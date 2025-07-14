import { Router } from 'express';
import * as authControllers from '../controllers/auth.js';
import ctrlWrapper from '../utils/ctrWrapper.js';
import validateBody from '../utils/validateBody.js';
import { authRegesterSchema, authLoginSchema, requestResetEmailSchema, resetPasswordSchema, authOAutGoogleSchema } from '../validation/auth.js';

const authRouter = Router();

authRouter.post('/register', validateBody(authRegesterSchema),
  ctrlWrapper(authControllers.regesterController),
);
authRouter.get('/verify',  ctrlWrapper(authControllers.verifyController),);
authRouter.post('/login', validateBody(authLoginSchema),
  ctrlWrapper(authControllers.loginController),
);

authRouter.post('/refresh', ctrlWrapper(authControllers.refreshController));
authRouter.post('/logout', ctrlWrapper(authControllers.logoutController));

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(authControllers.requestResetEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(authControllers.resetPasswordController),
);

authRouter.get(
  '/get-oauth-url',
  ctrlWrapper(authControllers.getGoogleOAuthController)
);

authRouter.post('/confirm-oauth', validateBody(authOAutGoogleSchema), ctrlWrapper(authControllers.loginWithGoogleController),);

export default authRouter;