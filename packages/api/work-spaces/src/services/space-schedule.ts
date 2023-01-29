import { Transaction } from 'sequelize/dist';
import SpaceSchedule, { SpaceScheduleInput } from '../db/models/SpaceSchedule';

// TODO: Move this logic to a helper class as it's similar to HourlySpaceService

export default class SpaceScheduleService {
  static async create(spaceId: number, payload: SpaceScheduleInput[], transaction?: Transaction, force?: boolean) {
    await SpaceSchedule.destroy({
      where: { spaceId },
      force,
      transaction,
    });

    return SpaceSchedule.bulkCreate(
      payload.map(({ id, ...rest }) => ({ ...rest, spaceId })),
      { transaction }
    );
  }

  static async findAllBySpace(spaceId: number) {
    return SpaceSchedule.scope({
      method: ['bySpace', spaceId],
    }).findAll();
  }
}
