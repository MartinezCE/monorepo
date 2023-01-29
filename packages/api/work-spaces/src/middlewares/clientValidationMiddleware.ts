import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { CLIENT_NOT_APPROVED } from '../config/errorCodes';
import User, { UserStatus } from '../db/models/User';
import { UserTypes } from '../db/models/UserType';
import getUser from './getUser';

const hasAccess = async (user: User) => {
  if (user.userType.value !== UserTypes.CLIENT) return;
  if (user.status === UserStatus.APPROVED) return;
  throw createHttpError(405, CLIENT_NOT_APPROVED);
};

const clientValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUser(req);
    await hasAccess(user);
    next();
  } catch (e) {
    next(e);
  }
};

export default clientValidationMiddleware;
