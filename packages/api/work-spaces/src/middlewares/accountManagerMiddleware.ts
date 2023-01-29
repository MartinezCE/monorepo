import { UNAUTHORIZED } from '@wimet/api-shared';
import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { UserRoleEnum } from '../common/enum/user';
import UserService from '../services/user';

const checkAccountManager = userRole => {
  if (userRole.value !== UserRoleEnum.ACCOUNT_MANAGER) {
    throw createHttpError(403, UNAUTHORIZED);
  }
};

const accountManagerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  const { status } = req.query;
  const userRole = await UserService.getUserRole(id);
  if (status && status !== 'PUBLISHED') {
    checkAccountManager(userRole);
  }
  return next();
};

export default accountManagerMiddleware;
