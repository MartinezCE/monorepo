import { NextFunction, Request, Response } from 'express';
import Country from '../db/models/Country';
import State from '../db/models/State';
import StateService from '../services/state';

export default class CountryController {
  static async getCountries(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await Country.findAll({
        include: [State],
        order: [
          ['name', 'ASC'],
          [State, 'name', 'ASC'],
        ],
      });
      res.send(response);
    } catch (error) {
      next(error);
    }
  }

  static async getAllStates(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = req.params;
      const response = await StateService.findAllByCountryId(Number(companyId));
      res.send(response);
    } catch (error) {
      next(error);
    }
  }
}
