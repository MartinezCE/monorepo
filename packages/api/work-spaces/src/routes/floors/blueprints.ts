import { upload } from '@wimet/api-shared';
import express from 'express';
import FloorController from '../../controllers/floor';

const blueprintRouter = express.Router({ mergeParams: true });

blueprintRouter.post('/', upload.array('blueprints'), FloorController.createBlueprint);

export default blueprintRouter;
