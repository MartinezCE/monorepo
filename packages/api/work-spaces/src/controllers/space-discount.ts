import { NextFunction, Request, Response } from 'express';
import logger from '../helpers/logger';
import SpaceDiscountService from '../services/space-discount';

const loggerInstance = logger('space-discount-controller');
export default class SpaceDiscountController {
  static async getDiscounts(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await SpaceDiscountService.getDiscountsAmount();
      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error getting the space discount', error);
      next(error);
    }
  }
}
