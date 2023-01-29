import ReservationType from '../db/models/SpaceReservationType';
import SpaceType from '../db/models/SpaceType';

export default class SpaceTypeService {
  static async getSpaceTypesByReservation(typeId: string) {
    return SpaceType.findAll({
      attributes: ['id', 'value'],
      include: [
        {
          model: ReservationType,
          required: true,
          attributes: [],
          through: {
            where: {
              spaceReservationTypeId: typeId,
            },
          },
        },
      ],
    });
  }

  static async findAll() {
    return SpaceType.findAll({
      attributes: ['id', 'value'],
    });
  }

  static async findByType(value: SpaceType['value']) {
    return SpaceType.findOne({ where: { value } });
  }
}
