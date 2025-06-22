import createHttpError from 'http-errors';
import * as authServices from '../services/auth.js';

export const regesterController = async (req, res) => {
  const data = await authServices.register(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered user',
  });
};

export const loginController = async (req, res) => {
  const { _id, accessToken, refreshToken, refreshTokenValidUntill } =
    await authServices.login(req.body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntill,
  });

  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntill,
  });

  res.json({
    status: 200,
    message: 'Successfully login user',
    data: {
      accessToken,
    },
  });
};
