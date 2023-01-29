import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user';
import AuthController from './auth';

export default class ImpersonateController {
  static async impersonate(req: Request<{ userId: number }>, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const user = await UserService.getUserById(userId);

      return await AuthController.login(req, res, next, user);
    } catch (e) {
      return next(e);
    }
  }
}
