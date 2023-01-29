import { upload, validationMiddleware } from '@wimet/api-shared';
import express from 'express';
import { checkSchema } from 'express-validator';
import SpaceController from '../../controllers/space';
import { FileTypes } from '../../interfaces';

const spaceFilesRouter = express.Router({ mergeParams: true });

spaceFilesRouter.get('/', SpaceController.getSpaceFiles);
spaceFilesRouter.post(
  '/',
  upload.array('spaceFiles'),
  checkSchema({
    type: {
      in: 'query',
      isIn: {
        options: [Object.keys(FileTypes)],
      },
    },
  }),
  validationMiddleware,
  SpaceController.addSpaceFiles
);
spaceFilesRouter.delete('/:fileId', SpaceController.removeSpaceFile);

export default spaceFilesRouter;
