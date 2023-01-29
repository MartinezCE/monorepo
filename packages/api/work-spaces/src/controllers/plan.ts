import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { PlanDTO } from '../dto/plan';
import CompanyService from '../services/company';
import CurrencyService from '../services/currency';
import HourlySpaceReservationService from '../services/hourly-space-reservation';
import PlanService from '../services/plan';
import UserService from '../services/user';
import PlanRenovationService from '../services/plan-renovation';
import logger from '../helpers/logger';
import { PENDING_NOT_ALLOWED } from '../config/errorCodes';

const loggerInstance = logger('plan-controller');

export default class PlanController {
  static async getUsedCredits(req: Request<{ planId: number }>, res: Response, next: NextFunction) {
    const { planId } = req.params;

    try {
      const company = await CompanyService.findCompanyByUserId(req.user.id, undefined, { rejectOnEmpty: true });
      const plan = await PlanService.getPlanById(planId, company.id, company.tz);
      const usedCredits = PlanService.getUsedCredits(plan);

      return res.send(usedCredits);
    } catch (e) {
      loggerInstance.error(`There was an error while getting used credits for plan ${planId}`);
      return next(e);
    }
  }

  static async getPlan(req: Request<{ planId: number }>, res: Response, next: NextFunction) {
    const { planId } = req.params;

    try {
      const company = await CompanyService.findCompanyByUserId(req.user.id, undefined, { rejectOnEmpty: true });
      const plan = await PlanService.getPlanById(planId, company.id, company.tz);

      return res.send(plan);
    } catch (e) {
      loggerInstance.error(`There was an error while getting plan ${planId}`);
      return next(e);
    }
  }

  static async updatePlan(req: Request<{ planId: number }, unknown, PlanDTO>, res: Response, next: NextFunction) {
    const { planId } = req.params;

    try {
      const company = await CompanyService.findCompanyByUserId(req.user.id, undefined, { rejectOnEmpty: true });

      if (req.body.status === 'PENDING') return createHttpError(401, PENDING_NOT_ALLOWED);

      const plan = await PlanService.updatePlan(planId, company.id, req.body);

      return res.send(plan);
    } catch (e) {
      loggerInstance.error(`There was an error while updating plan ${planId}`);
      return next(e);
    }
  }

  static async getUsers(req: Request<{ planId: number }>, res: Response, next: NextFunction) {
    const { planId } = req.params;

    try {
      const company = await CompanyService.findCompanyByUserId(req.user.id, undefined, { rejectOnEmpty: true });
      const users = await UserService.getUsersByPlan(planId, company.id);

      return res.send(users);
    } catch (e) {
      loggerInstance.error(`There was an error while getting users for plan ${planId}`);
      return next(e);
    }
  }

  static async getReservations(req: Request<{ planId: number }>, res: Response, next: NextFunction) {
    const { planId } = req.params;

    try {
      const company = await CompanyService.findCompanyByUserId(req.user.id, undefined, { rejectOnEmpty: true });
      const plan = await PlanService.getPlanById(planId, company.id, company.tz);
      const reservations = await HourlySpaceReservationService.getReservationsByPlan(plan.id);

      return res.send(reservations);
    } catch (e) {
      loggerInstance.error(`There was an error while getting reservations for plan ${planId}`);
      return next(e);
    }
  }

  static async getRenovations(req: Request<{ planId: number }>, res: Response, next: NextFunction) {
    const { planId } = req.params;

    try {
      const company = await CompanyService.findCompanyByUserId(req.user.id, undefined, { rejectOnEmpty: true });
      const plan = await PlanService.getPlanById(planId, company.id, company.tz);
      const planRenovations = await PlanRenovationService.getPreviousRenovations(plan.id);
      const currencyIds = planRenovations.flatMap(r => r.hourlySpaceReservations.map(s => s.credit.currencyId));

      const currencies = await CurrencyService.getByIds(currencyIds);

      const renovations = planRenovations.map(r => {
        const renovation = r.toJSON();
        const { usedCredits, values } = PlanRenovationService.getUsedCredits(r);

        return {
          ...renovation,
          usedCredits,
          values: values.map(v => ({ ...v, currency: currencies.find(c => c.id === v.currencyId) })),
        };
      });

      return res.send(renovations);
    } catch (e) {
      loggerInstance.error(`There was an error while getting reservations for plan ${planId}`);
      return next(e);
    }
  }

  static async deletePlan(req: Request<{ planId: number }>, res: Response, next: NextFunction) {
    const { planId } = req.params;
    const { id } = req.user;

    try {
      const company = await CompanyService.findCompanyByUserId(id);
      await PlanService.deletePlan(planId, company.id);

      return res.sendStatus(204);
    } catch (e) {
      loggerInstance.error(`There was an error while deleting plan ${planId}`);
      return next(e);
    }
  }

  static async deletePlanUser(req: Request, res: Response, next: NextFunction) {
    const { planId, userId } = req.params;

    try {
      await PlanService.deletePlanUser(Number(planId), Number(userId));

      return res.sendStatus(204);
    } catch (e) {
      loggerInstance.error(`There was an error while deleting user: ${userId} from plan: ${planId}`);
      return next(e);
    }
  }

  static async createPlanUser(req: Request, res: Response, next: NextFunction) {
    const { planId } = req.params;

    try {
      const result = await PlanService.createPlanUser(Number(planId), req.body.users);

      return res.send(result);
    } catch (e) {
      loggerInstance.error(`There was an error while creating users for plan: ${planId}`);
      return next(e);
    }
  }
}
