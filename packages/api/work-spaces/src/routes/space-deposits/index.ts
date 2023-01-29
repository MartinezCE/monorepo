import express from 'express';
import SpaceDepositController from '../../controllers/space-deposit';

const spaceDepositsRouter = express.Router();

spaceDepositsRouter.use('/', SpaceDepositController.getDeposits);

export default spaceDepositsRouter;
