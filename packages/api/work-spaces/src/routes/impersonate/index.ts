import express from 'express';
import ImpersonateController from '../../controllers/impersonate';

const impersonateRouter = express.Router();

impersonateRouter.post('/:userId', ImpersonateController.impersonate);

export default impersonateRouter;
