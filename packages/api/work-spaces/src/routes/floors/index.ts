import express from 'express';
import FloorController from '../../controllers/floor';
import blueprintRouter from './blueprints';

const floorRouter = express.Router();

floorRouter.use('/:floorId/blueprints', blueprintRouter);
floorRouter.delete('/:floorId', FloorController.delete);

export default floorRouter;
