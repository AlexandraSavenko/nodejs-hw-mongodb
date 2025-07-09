import createHttpError from 'http-errors';
import userCollection from '../db/models/User.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import Handlebars from 'handlebars';
import jwt from 'jsonwebtoken';

import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/users.js';

//--------------------------------------------------------------------------------------------


import {env} from '../utils/env.js';

import { sendEmail } from '../utils/sendMail.js';

import { TEMPLATE_DIR } from '../constants/index.js';
import SessionCollection from '../db/models/sessions.js';

const verifyEmailTemplatePath = path.join(TEMPLATE_DIR, 'verify-email.html');
const appDomain = env('APP_DOMAIN');
const jwtSecret = env('JWT_SECRET');

//---------------------------------------------------------------------------------------------
const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntill: Date.now() + accessTokenLifetime,
    refreshTokenValidUntill: Date.now() + refreshTokenLifetime,
  };
};
//--------------------------------------------------------------------------------------------------------
export const register = async (payload) => {
  const { email, password } = payload;
  const user = await userCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email already is used');
  }
  const hashPassword = await bcrypt.hash(password, 10);

  // return await userCollection.create({...payload, password: hashPassword,});
  const newUser = await userCollection.create({
    ...payload,
    password: hashPassword,
  });
  //-----------------------------------------------------------------------------
  //module6 lesson 1 58min creating emailTemplate
  const templateSourse = await fs.readFile(verifyEmailTemplatePath, 'utf-8');

  const template = Handlebars.compile(templateSourse);

  const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1h' });

  const html = template({
    link: `${appDomain}/auth/verify?token=${token}`,
  });
//------------------------------------------------------------------------
  const verifyEmail = {
    to: email,
    subject: 'verify email',
    html,
  };

  await sendEmail(verifyEmail);
  return newUser;
};
//--------------------------------------------------------------------------------------------
export const verify = async (token) => {
  try {
    const { email } = jwt.verify(token, jwtSecret);
    const user = await findUser({ email });

    if (!user) {
      throw createHttpError(404, 'User not found!');
    }
   await userCollection.findByIdAndUpdate(user._id, { verify: true });

  } catch (error) {
    throw createHttpError(401, error.message);
  }
};

//----------------------------------------------------------------------------------------------
export const login = async ({ email, password }) => {
  const user = await userCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password is incorrect');
  }
  if (!user.verify) {
    throw createHttpError(401, 'Email not verified');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password is incorrect');
  }
  await SessionCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  return SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
};
//---------------------------------------------------------------------------------------------
export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) {
    return createHttpError(401, 'session not found');
  }
  if (Date.now() > session.refreshTokenValidUntill) {
    return createHttpError(401, 'session token expired');
  }
  await SessionCollection.deleteOne({ _id: session._id });

  const newSession = createSession();
  return SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logout = (sessionId) =>
  SessionCollection.deleteOne({ _id: sessionId });

export const findSession = (filter) => SessionCollection.findOne(filter);

export const findUser = (filter) => userCollection.findOne(filter);

//------------------------------------------------------------------------------------------
export const requestResetToken = async (email) => {

  const user = await userCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
   jwtSecret,
    {
      expiresIn: '5m',
    },
  );

const resetPasswordTemplatePath = path.join(
    TEMPLATE_DIR,
    'reset-password-email.html',
  );

  const passTemplateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const passTemplate = Handlebars.compile(passTemplateSource);
  const html = passTemplate({
    name: user.name,
    link: `${appDomain}/reset-password?token=${resetToken}`,
  });
await sendEmail({
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, jwtSecret);
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await userCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await userCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};