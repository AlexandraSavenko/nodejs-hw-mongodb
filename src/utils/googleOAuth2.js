import { OAuth2Client } from 'google-auth-library';
import * as path from 'node:path';
import { readFile } from 'node:fs/promises';
import { env } from './env.js';
import createHttpError from 'http-errors';

const googleOAuthSettingPath = path.resolve('google-oauth.json');

const oauthConfig = JSON.parse(await readFile(googleOAuthSettingPath, 'utf-8'));

const client_id = env('CLIENT_AUTH_ID');
const client_secret = env('CLIENT_AUTH_SECRET');

const googleOAuthClient = new OAuth2Client({
  client_id,
  client_secret,
  redirectUri: oauthConfig.web.redirect_uris[0],
});

export const generateAuthUrl = () =>
  googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

export const validateCode = async (code) => {
  const response = await googleOAuthClient.getToken(code);
  if (!response.tokens.id_token) {
    throw createHttpError(401);
  }

  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });
  return ticket;
};

export const getUserNameFromGoogleTokenPayload = (payload) => {
  if (payload.name) return payload.name;
  let userName = '';
  if (payload.given_name) {
    userName += payload.given_name;
  }
  if (payload.family_name) {
    userName += payload.family_name;
  }
  return userName;
};
