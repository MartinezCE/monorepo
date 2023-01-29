import { validationMiddleware } from '@wimet/api-shared';
import express from 'express';
import { checkSchema } from 'express-validator';
import SpaceController from '../../controllers/space';
import spaceAmenitiesRouter from './amenity';
import spaceFilesRouter from './files';
import spaceTypesRouter from './space-type';
import { authMiddleware } from '../../middlewares/authMiddleware';

const spaceRouter = express.Router();

spaceRouter.get('/:spaceId/', SpaceController.getSpace);
spaceRouter.use('/types', spaceTypesRouter);

spaceRouter.patch(
  '/:spaceId',
  authMiddleware,
  checkSchema({
    name: {
      isString: true,
      optional: true,
    },
    peopleCapacity: {
      isInt: true,
      optional: true,
      isLength: {
        options: { min: 1 },
      },
    },
    area: {
      isDecimal: true,
      optional: true,
      isLength: {
        options: { min: 1 },
      },
    },
    spaceTypeId: {
      isInt: true,
      optional: true,
      isLength: {
        options: { min: 1 },
      },
    },
    spaceReservationTypeId: {
      isInt: true,
      optional: true,
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
  SpaceController.editSpace
);
spaceRouter.delete('/:spaceId', authMiddleware, SpaceController.deleteSpace);
spaceRouter.use('/:spaceId/amenities', authMiddleware, spaceAmenitiesRouter);
spaceRouter.use('/:spaceId/files', authMiddleware, spaceFilesRouter);

export default spaceRouter;
