import { validationMiddleware } from '@wimet/api-shared';
import express from 'express';
import { checkSchema } from 'express-validator';
import SpaceController from '../../controllers/space';

const spaceAmenitiesRouter = express.Router({ mergeParams: true });

spaceAmenitiesRouter.post(
  '/',
  checkSchema({
    name: {
      isString: true,
    },
  }),
  validationMiddleware,
  SpaceController.createSpaceAmenity
);
spaceAmenitiesRouter.delete('/:amenityId', SpaceController.removeSpaceAmenity);

export default spaceAmenitiesRouter;
