import { FindOptions, Transaction } from 'sequelize/dist';
import MonthlySpace from '../db/models/MonthlySpace';
import SpaceDiscountMonthlySpace from '../db/models/SpaceDiscountMonthlySpace';
import { MonthlyDTO } from '../dto/monthly-space';

export default class MonthlySpaceService {
  static async createOrEdit(spaceId: number, payload: MonthlyDTO, transaction?: Transaction) {
    const { maxMonthsAmount, minMonthsAmount, price, spaceDepositId, spaceDiscounts } = payload || {};
    const monthlySpace = await MonthlySpaceService.findBySpace(spaceId);
    const [newMonthlySpace] = await MonthlySpace.upsert(
      {
        maxMonthsAmount,
        minMonthsAmount,
        price,
        spaceId,
        id: monthlySpace?.id,
      },
      { transaction }
    );

    if (spaceDepositId || spaceDepositId === null) {
      await newMonthlySpace.setSpaceDeposits(spaceDepositId ? [spaceDepositId] : [], { transaction });
    }

    if (spaceDiscounts) {
      await newMonthlySpace.setSpaceDiscounts([], { transaction });
      await SpaceDiscountMonthlySpace.bulkCreate(
        spaceDiscounts.map(discount => ({
          percentage: discount.percentage,
          monthlySpaceId: newMonthlySpace.id,
          spaceDiscountId: discount.spaceDiscountId,
        })),
        { transaction }
      );
    }
  }

  static async findBySpace(spaceId: number, options?: FindOptions<MonthlySpace['_attributes']>) {
    return MonthlySpace.scope({
      method: ['bySpace', spaceId],
    }).findOne(options);
  }
}
