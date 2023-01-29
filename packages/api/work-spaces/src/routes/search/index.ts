import express from 'express';
import SearchController from '../../controllers/search';

const searchRouter = express.Router();

searchRouter.get('/spaces', SearchController.findSpaces);

export default searchRouter;
