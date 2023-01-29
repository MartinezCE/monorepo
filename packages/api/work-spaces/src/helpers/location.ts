import { Transaction } from 'sequelize/dist';
import Company from '../db/models/Company';
import Location, { LocationStatus } from '../db/models/Location';
import User from '../db/models/User';
import { LocationDTO } from '../dto/location';
import StateService from '../services/state';

export default class LocationHelper {
  static async createLocation(userId: number, payload: LocationDTO, companyId?: number, transaction?: Transaction) {
    const company = await Company.findOne({
      where: { id: companyId },
      include: [
        {
          model: User,
          where: { id: userId },
        },
      ],
      rejectOnEmpty: true,
      transaction,
    });

    const state = await StateService.findOneById(company.stateId);
    const { currencyId } = state.country;

    const location = await Location.create({ ...payload, companyId: company.id, currencyId }, { transaction });

    return { company, location };
  }

  static async editLocation(userId: number, payload: LocationDTO, locationId: number, transaction?: Transaction) {
    const location = await Location.scope({
      method: ['byUser', userId, locationId],
    }).findOne({
      transaction,
      rejectOnEmpty: true,
    });

    return location.update(payload, { transaction });
  }

  static async findOrCreateByUser(
    id: number,
    userId: number,
    companyId: number,
    payload: LocationDTO,
    transaction: Transaction,
    locationStatusOnCreate?: LocationStatus
  ): Promise<[Location, boolean]> {
    let location: Location;
    let created = false;

    if (id) {
      location = await LocationHelper.editLocation(userId, payload, id, transaction);
    } else {
      payload.status = locationStatusOnCreate;

      ({ location } = await LocationHelper.createLocation(userId, payload, companyId, transaction));
      created = true;
    }

    return [location, created];
  }
}
