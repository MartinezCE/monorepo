import { validationMiddleware } from '@wimet/api-shared';
import express from 'express';
import { checkSchema } from 'express-validator';
import LocationController from '../../controllers/location';
import { authMiddleware } from '../../middlewares/authMiddleware';

const spaceRouter = express.Router({ mergeParams: true });

spaceRouter.get('/', LocationController.getAllSpaces);

spaceRouter.post(
  '/',
  authMiddleware,
  checkSchema({
    name: {
      isString: true,
    },
    peopleCapacity: {
      isInt: true,
      isLength: {
        options: { min: 1 },
      },
    },
    area: {
      isDecimal: true,
      isLength: {
        options: { min: 1 },
      },
    },
    spaceTypeId: {
      isInt: true,
      isLength: {
        options: { min: 1 },
      },
    },
    spaceReservationTypeId: {
      isInt: true,
      isLength: {
        options: { min: 1 },
      },
    },
    spaceOfferId: {
      isInt: true,
      optional: {
        options: {
          nullable: true,
        },
      },
      isLength: {
        options: { min: 1 },
      },
    },
  }),
  validationMiddleware,
  LocationController.createSpace
);

export default spaceRouter;
