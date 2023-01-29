import express from 'express';
import CreditsController from '../controllers/credits';

const creditsRouter = express.Router();

creditsRouter.get('/', CreditsController.getAll);

export default creditsRouter;
