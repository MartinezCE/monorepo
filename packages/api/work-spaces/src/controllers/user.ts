import { s3 } from '@wimet/api-shared';
import { NextFunction, Request, Response } from 'express';
import User from '../db/models/User';
import logger from '../helpers/logger';
import { S3File } from '../interfaces';
import CompanyService from '../services/company';
import HourlySpaceReservationService from '../services/hourly-space-reservation';
import PlanService from '../services/plan';
import WPMReservationService from '../services/wpm-reservation';
import UserService from '../services/user';

const scope = {
  PARTNER: process.env.PARTNERS_BASE_URL,
  CLIENT: process.env.CLIENTS_BASE_URL,
};

const loggerInstance = logger('user-controller');

export default class UserController {
  static addProfileUrl(user: User) {
    return { ...(user?.toJSON?.() || user), profileUrl: scope[user.userType.value] };
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(req.user.id);
      res.send(UserController.addProfileUrl(user));
    } catch (e) {
      loggerInstance.error(`Error getting user with id ${req.user.id}`, e);
      next(e);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;

      await UserService.setUser(id, req.body);

      res.sendStatus(204);
    } catch (error) {
      loggerInstance.error('There was an error updating the user data', error);
      next(error);
    }
  }

  static async setUserAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const { location, key } = req.file as S3File;

      const user = await UserService.getUserById(id);

      if (user.avatarKey) {
        s3.deleteObject({ Bucket: process.env.AWS_LOCATIONS_BUCKET, Key: user.avatarKey });
      }

      await UserService.setUserAvatar(id, location, key);

      res.sendStatus(204);
    } catch (error) {
      loggerInstance.error('There was an error updating the user avatar', error);

      next(error);
    }
  }

  static async getReservations(req: Request, res: Response, next: NextFunction) {
    try {
      const reservations = await HourlySpaceReservationService.getReservationsByUser(req.user.id);

      res.send(reservations);
    } catch (error) {
      loggerInstance.error('There was an error getting the user reservations', error);
      next(error);
    }
  }

  static async getWPMReservations(req: Request, res: Response, next: NextFunction) {
    try {
      const reservations = await WPMReservationService.getAllReservationsByUser(req.user.id);

      res.send(reservations);
    } catch (error) {
      loggerInstance.error('There was an error getting the user WPM reservations', error);
      next(error);
    }
  }

  static async getUserPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const company = await CompanyService.findCompanyByUserId(id);
      const plan = await PlanService.getPlanByUser(id, company.id, company.tz);
      const planUsedCredits = PlanService.getUsedCreditsByUser(plan, id);
      res.send({ ...plan.toJSON(), ...planUsedCredits });
    } catch (error) {
      loggerInstance.error('There was an error getting the user reservations', error);
      next(error);
    }
  }

  static async getUserReservation(
    req: Request<{ locationId: number }, unknown, unknown, { date: Date; locationId: number }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user;
      const { date, locationId } = req.query;
      // TODO: Add +/- half day to avoid req.timezone in both origin and destination
      const reservation = await WPMReservationService.getReservationsByLocation(
        id,
        locationId,
        date,
        req.timezone,
        req.timezone
      );
      res.send(reservation);
    } catch (error) {
      loggerInstance.error('There was an error getting the user reservations', error);
      next(error);
    }
  }

  static async updateUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, userRoleId } = req.body;
      const user = await UserService.getUserById(userId);
      await UserService.setUserRole(user.id, userRoleId as User['userRoleId']);
      res.send({});
    } catch (error) {
      loggerInstance.error('There was an error updating the user role', error);
      next(error);
    }
  }

  static async updateUserPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, userPlanId } = req.body;
      const user = await UserService.getUserById(userId);
      const plan = await UserService.setUserPlan(user.id, userPlanId);
      res.send(plan);
    } catch (error) {
      loggerInstance.error('There was an error updating the user plan', error);
      next(error);
    }
  }
}
