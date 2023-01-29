import express from 'express';
import SpaceWPMReservationController from '../../../controllers/space-reservation';

const spaceTypesRouter = express.Router({ mergeParams: true });

spaceTypesRouter.get('/', SpaceWPMReservationController.getSpaceTypesByReservation);

export default spaceTypesRouter;
