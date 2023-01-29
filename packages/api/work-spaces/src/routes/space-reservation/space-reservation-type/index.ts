import express from 'express';
import SpaceWPMReservationController from '../../../controllers/space-reservation';
import spaceTypesRouter from './space-type';

const spaceReservationTypesRouter = express.Router();

spaceReservationTypesRouter.get('/', SpaceWPMReservationController.getReservationTypes);
spaceReservationTypesRouter.use('/:typeId/space-types', spaceTypesRouter);

export default spaceReservationTypesRouter;
