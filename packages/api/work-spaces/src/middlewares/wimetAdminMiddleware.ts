import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { USER_INSUFFICIENT_PERMISSIONS } from '../config/errorCodes';
import User from '../db/models/User';
import getUser from './getUser';

const hasAccess = async (user: User) => {
  if (user.isWimetAdmin) return;
  throw createHttpError(403, USER_INSUFFICIENT_PERMISSIONS);
};

const wimetAdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUser(req);
    await hasAccess(user);
    next();
  } catch (e) {
    next(e);
  }
};

export default wimetAdminMiddleware;
