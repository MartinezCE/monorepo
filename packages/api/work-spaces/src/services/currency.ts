import { isUndefined } from 'lodash';
import { Op } from 'sequelize';
import Country from '../db/models/Country';
import Currency from '../db/models/Currency';
import State from '../db/models/State';

export default class CurrencyService {
  static async getByState(stateId: number) {
    return Currency.findOne({
      include: {
        model: Country,
        required: true,
        attributes: ['id'],
        include: [{ model: State, required: true, attributes: [], where: { id: stateId } }],
      },
      rejectOnEmpty: true,
    });
  }

  static async getByIds(ids?: number[]) {
    return Currency.findAll(!isUndefined(ids) ? { where: { id: { [Op.in]: ids } } } : {});
  }
}
