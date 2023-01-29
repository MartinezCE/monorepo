import SpaceDeposit from '../db/models/SpaceDeposit';

export default class SpaceDepositService {
  static async getDepositsAmount() {
    return SpaceDeposit.findAll({
      attributes: ['id', 'months_amount'],
    });
  }
}
