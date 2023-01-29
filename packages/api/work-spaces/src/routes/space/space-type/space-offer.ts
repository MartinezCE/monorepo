import express from 'express';
import SpaceController from '../../../controllers/space';

const spaceOffersRouter = express.Router({ mergeParams: true });

spaceOffersRouter.get('/', SpaceController.getSpaceOffersBySpaceType);

export default spaceOffersRouter;
