import express from 'express';
import spaceOffersRouter from './space-offer';
import SpaceController from '../../../controllers/space';

const spaceTypesRouter = express.Router();

spaceTypesRouter.get('/all', SpaceController.getAllSpacesTypes);
spaceTypesRouter.use('/:typeId/space-offers', spaceOffersRouter);

export default spaceTypesRouter;
