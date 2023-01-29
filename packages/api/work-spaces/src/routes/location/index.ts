import { validationMiddleware } from '@wimet/api-shared';
import express from 'express';
import { checkSchema, Schema } from 'express-validator';
import { locationValidationSchema } from '../../common/validation/location';
import { authMiddleware } from '../../middlewares/authMiddleware';
import LocationController from '../../controllers/location';
import locationAmenitiesRouter from './amenity';
import locationFilesRouter from './files';
import seatsRouter from './seats';
import spaceRouter from './space';

const locationsRouter = express.Router();

locationsRouter.use('/:locationId/spaces', spaceRouter);

locationsRouter.get('/:locationId', authMiddleware, LocationController.getLocation);
locationsRouter.patch(
  '/:locationId',
  authMiddleware,
  checkSchema(locationValidationSchema as Schema),
  validationMiddleware,
  LocationController.updateLocation
);
locationsRouter.delete('/:locationId', authMiddleware, LocationController.deleteLocation);
locationsRouter.post('/bulk', authMiddleware, LocationController.bullkCreateSeats);
locationsRouter.use('/:locationId/amenities', authMiddleware, locationAmenitiesRouter);
locationsRouter.use('/:locationId/files', authMiddleware, locationFilesRouter);
locationsRouter.use('/:locationId/seats', authMiddleware, seatsRouter);

export default locationsRouter;
