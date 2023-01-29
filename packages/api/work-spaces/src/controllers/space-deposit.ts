import { NextFunction, Request, Response } from 'express';
import logger from '../helpers/logger';
import SpaceDepositService from '../services/space-deposit';

const loggerInstance = logger('space-deposit-controller');

export default class SpaceDepositController {
  static async getDeposits(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await SpaceDepositService.getDepositsAmount();
      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error getting the space deposit', error);
      next(error);
    }
  }
}
