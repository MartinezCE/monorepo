import { upload, validationMiddleware } from '@wimet/api-shared';
import express from 'express';
import { checkSchema } from 'express-validator';
import LocationController from '../../controllers/location';
import { FileTypes } from '../../interfaces';

const locationFilesRouter = express.Router({ mergeParams: true });

locationFilesRouter.post(
  '/',
  upload.array('locationFiles'),
  checkSchema({
    type: {
      in: 'query',
      isIn: {
        options: [Object.keys(FileTypes)],
      },
    },
  }),
  validationMiddleware,
  LocationController.addLocationFiles
);
locationFilesRouter.delete('/:fileId', LocationController.removeLocationFile);

export default locationFilesRouter;
