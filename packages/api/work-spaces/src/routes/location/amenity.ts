import { validationMiddleware } from '@wimet/api-shared';
import express from 'express';
import { checkSchema } from 'express-validator';
import LocationController from '../../controllers/location';

const locationAmenitiesRouter = express.Router({ mergeParams: true });

locationAmenitiesRouter.post(
  '/',
  checkSchema({
    name: {
      isString: true,
    },
  }),
  validationMiddleware,
  LocationController.createLocationAmenity
);
locationAmenitiesRouter.delete('/:amenityId', LocationController.removeLocationAmenity);

export default locationAmenitiesRouter;
