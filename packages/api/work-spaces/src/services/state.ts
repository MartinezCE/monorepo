import Country from '../db/models/Country';
import State from '../db/models/State';
import logger from '../helpers/logger';

const loggerInstance = logger('state-service');

export default class StateService {
  static async findOneById(id: number) {
    return State.findByPk(id, { include: Country, rejectOnEmpty: true });
  }

  static async findAllByCountryId(countryId: number) {
    return State.findAll({
      where: { countryId },
      order: [['name', 'ASC']],
      logging: m => loggerInstance.debug(m),
    });
  }
}
