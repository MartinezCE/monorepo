import { NextFunction, Request, Response } from 'express';
import Credits from '../db/models/Credits';
import FiltersHelper from '../helpers/filters';
import CreditsService from '../services/credits';

export default class CreditsController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    const filters = FiltersHelper.clean(Credits, req.query);

    try {
      const response = await CreditsService.getAll(filters);
      res.send(response);
    } catch (error) {
      next(error);
    }
  }
}
