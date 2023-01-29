/* eslint-disable import/no-cycle */
import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { Transaction } from 'sequelize/dist';
import { WPM_NOT_ENABLED, WPM_NOT_ENABLED_WITH_LOCATIONS } from '../config/errorCodes';
import User from '../db/models/User';
import { UserTypes } from '../db/models/UserType';
import ClientLocationService from '../services/client-location';
import getUser from './getUser';

const hasAccess = async ({
  user,
  transaction,
  checkLocations,
}: {
  user: User;
  checkLocations?: boolean;
  transaction?: Transaction;
}) => {
  const locations = checkLocations ? await ClientLocationService.findAllByUser(user.id, transaction) : null;

  if (user.userType.value !== UserTypes.CLIENT) return;
  if (user.isWPMEnabled) return;

  if (!checkLocations) throw createHttpError(403, WPM_NOT_ENABLED);
  if (locations.length) throw createHttpError(403, WPM_NOT_ENABLED_WITH_LOCATIONS);
};

const wpmValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUser(req);
    await hasAccess({ user, checkLocations: true });
    next();
  } catch (e) {
    next(e);
  }
};

export default wpmValidationMiddleware;
