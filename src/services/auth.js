import createHttpError from 'http-errors';
import userCollection from '../db/models/User.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import SessionCollection from '../db/models/Sessions.js';

import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/users.js';

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

export const register = async (payload) => {
  const { email, password } = payload;
  const user = await userCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const hashPassword = await bcrypt.hash(password, 10);
  return userCollection.create({ ...payload, password: hashPassword });
};

export const login = async ({ email, password }) => {
  const user = await userCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password is incorrect');
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

export const logout = sessionId => SessionCollection.deleteOne({_id: sessionId});


export const findSession = (filter) => SessionCollection.findOne(filter);

export const findUser = (filter) => userCollection.findOne(filter);
