import createHttpError from 'http-errors';
import { findSession, findUser } from '../services/auth.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
     return next(createHttpError(401, 'Authorization header missing'));
  }
  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer') {
    console.log('not bearer');

    return next(
      createHttpError(401, 'Authorization header must be type Bearer'),
    );
  }

  const session = await findSession({ accessToken: token });

  if (!session) {
    console.log('not session');

    return next(createHttpError(401, 'Session not found'));
  }

  if (Date.now() > session.accessTokenValidUntill) {
    console.log('token expired');

    return next(createHttpError(401, 'access token expired'));
  }

  const user = await findUser({ _id: session.userId });
  if (!user) {
    console.log('not user');
    return next(createHttpError(401, 'user not found'));
  }

  req.user = user;
  next();
};
