import SpaceDiscount from '../db/models/SpaceDiscount';

export default class SpaceDiscountService {
  static async getDiscountsAmount() {
    return SpaceDiscount.findAll({
      attributes: ['id', 'months_amount'],
    });
  }
}
