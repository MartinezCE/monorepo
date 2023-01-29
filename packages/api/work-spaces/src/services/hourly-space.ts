/* eslint-disable import/no-cycle */
import { FindOptions, Transaction } from 'sequelize/dist';
import HourlySpace, { HourlySpaceInput } from '../db/models/HourlySpace';
import HourlySpaceHistory from '../db/models/HourlySpaceHistory';
import SpaceService from './space';

export default class HourlySpaceService {
  static async create(spaceId: number, payload?: HourlySpaceInput[], transaction?: Transaction) {
    const hourlySpaces = await HourlySpace.bulkCreate(
      payload.map(({ id, ...rest }) => ({ ...rest, spaceId })),
      { transaction }
    );

    return HourlySpaceHistory.bulkCreate(
      hourlySpaces.map(({ id, dayOfWeek, price, halfDayPrice, fullDayPrice, minHoursAmount }) => ({
        previousHourlySpaceId: id,
        dayOfWeek,
        price,
        halfDayPrice,
        fullDayPrice,
        minHoursAmount,
        spaceId,
      })),
      { transaction }
    );
  }

  static async findAllBySpace(spaceId: number, options?: FindOptions<HourlySpace['_attributes']>) {
    return HourlySpace.scope({
      method: ['bySpace', spaceId],
    }).findAll(options);
  }

  static getAveragePrice(hourlySpaces: HourlySpace[]) {
    return hourlySpaces.reduce((acc, el) => acc + Number(el.price), 0) / hourlySpaces.length;
  }

  static addCredits(hourlySpaces: HourlySpace[], creditPrice: number, feePercentage: number) {
    return hourlySpaces.map(h => ({
      ...h.toJSON(),
      dayCreditsWithFee: SpaceService.getCreditsCount(h.price, creditPrice, feePercentage),
      halfDayCreditsWithFee: SpaceService.getCreditsCount(h.halfDayPrice, creditPrice, feePercentage),
      fullDayCreditsWithFee: SpaceService.getCreditsCount(h.fullDayPrice, creditPrice, feePercentage),
    }));
  }

  static async removeFromSpace(spaceId: number, transaction?: Transaction) {
    return HourlySpace.destroy({ where: { spaceId }, transaction });
  }
}
