import express from 'express';
import { validationMiddleware } from '@wimet/api-shared';
import AuthController from '../../controllers/auth';

const passwordRecoveryRouter = express.Router();

passwordRecoveryRouter.post('/', validationMiddleware, AuthController.passwordRecoveryRequest);
passwordRecoveryRouter.post('/confirm', validationMiddleware, AuthController.updatePassword);

export default passwordRecoveryRouter;
