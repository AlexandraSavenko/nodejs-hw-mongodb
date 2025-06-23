import { Router } from 'express';
import * as authControllers from '../controllers/auth.js';
import ctrlWrapper from '../utils/ctrWrapper.js';
import validateBody from '../utils/validateBody.js';
import { authRegesterSchema, authLoginSchema } from '../validation/auth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(authRegesterSchema),
  ctrlWrapper(authControllers.regesterController),
);

authRouter.post(
  '/login',
  validateBody(authLoginSchema),
  ctrlWrapper(authControllers.loginController),
);

authRouter.post('/refresh', ctrlWrapper(authControllers.refreshController));
authRouter.post('/logout', ctrlWrapper(authControllers.logoutController));


export default authRouter;
