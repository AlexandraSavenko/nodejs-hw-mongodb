// import createHttpError from 'http-errors';
import * as authServices from '../services/auth.js';
import { requestResetToken } from '../services/auth.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';

const setupSession = (res, session) => {
  const { _id, refreshToken, refreshTokenValidUntill } = session;
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntill,
  });

  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntill,
  });
};

export const regesterController = async (req, res) => {
  const data = await authServices.register(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data
  });
};

export const verifyController = async (req, res) => {
  console.log("verifyController works");
const {token} = req.query;
await authServices.verify(token);
res.json({
       status: 200,
       message: "Email has been verified",
       data: {}
   });
};
export const loginController = async (req, res) => {
  const session = await authServices.login(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully login user',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshController = async (req, res) => {
  const session = await authServices.refreshUserSession(req.cookies);
  setupSession(res, session);
  res.json({
    status: 200,
    message: 'Successfully refreshed session',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {

if(req.cookies.sessionId){
  await authServices.logout(req.cookies.sessionId);
}
res.clearCookie("sessionId");
res.clearCookie("refreshToken");
res.status(204).send();

};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    message: 'Reset password email has been successfully sent.',
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await authServices.resetPassword(req.body);
  res.json({
    message: 'Password has been successfully reset.',
    status: 200,
    data: {},
  });
};

export const getGoogleOAuthController = async (req, res) => {
const url = generateAuthUrl();
res.json({
  status: 200,
  message: "Successully get Google OAuth url",
  data: {
    url,
  }
});
};

export const loginWithGoogleController = async (req, res) => {
const session = await authServices.loginOrRegisterWithGoogle(req.body.code);
  setupSession(res, session);
  res.json({
    status: 200,
    message: 'Successfully logged in with Google',
    data: {
      accessToken: session.accessToken,
    },
  });
};