import express from 'express';
import googleAuthRouter from './google';
import signInRouter from './signIn';
import signUpRouter from './signUp';
import passwordRecoveryRouter from './passwordRecovery';
import AuthController from '../../controllers/auth';

const authRouter = express.Router();

authRouter.use('/', googleAuthRouter);
authRouter.use('/sign-in', signInRouter);
authRouter.use('/password-recovery', passwordRecoveryRouter);
authRouter.use('/sign-out', AuthController.signOut);
authRouter.use('/sign-up', signUpRouter);

export default authRouter;
