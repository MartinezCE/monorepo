import express from 'express';
import SpaceDiscountController from '../../controllers/space-discount';

const spaceDiscountsRouter = express.Router();

spaceDiscountsRouter.use('/', SpaceDiscountController.getDiscounts);

export default spaceDiscountsRouter;
