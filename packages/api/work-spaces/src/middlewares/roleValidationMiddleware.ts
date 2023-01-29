import { UNAUTHORIZED } from '@wimet/api-shared';
import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { UserRoleEnum } from '../common/enum/user';
import getUser from './getUser';

const roleValidationMiddleware =
  (roles: UserRoleEnum[]) =>
  async (req: Request<unknown, unknown, unknown, unknown>, res: Response<unknown>, next: NextFunction) => {
    try {
      const user = await getUser(req);
      if (!roles.find(item => item === user.userRole.value)) {
        throw createHttpError(403, UNAUTHORIZED);
      }
      next();
    } catch (e) {
      next(e);
    }
  };

export default roleValidationMiddleware;
