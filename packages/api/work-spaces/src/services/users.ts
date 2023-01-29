import createHttpError from 'http-errors';
import { Op } from 'sequelize';
import { INVALID_AMENITIES_IDS } from '../config/errorCodes';
import db from '../db';
import AmenityService from './amenity';
import UserService from './user';

export default class UsersService {
  static async setAmenities(userId: number, companyId: number, amenitiesId: number[]) {
    return db.transaction(async transaction => {
      const [user, amenities] = await Promise.all([
        UserService.getUserById(userId, transaction),
        AmenityService.findAllFromSeatsOfCompany(companyId, undefined, {
          where: {
            id: { [Op.in]: amenitiesId },
          },
          transaction,
        }),
      ]);

      if (amenities.length !== amenitiesId.length) throw createHttpError(400, INVALID_AMENITIES_IDS);

      await user.setAmenities(amenities);
    });
  }
}
