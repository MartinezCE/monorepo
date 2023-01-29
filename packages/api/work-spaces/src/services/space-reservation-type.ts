import SpaceReservationType from '../db/models/SpaceReservationType';

export default class SpaceReservationTypeService {
  static async getReservationTypes() {
    return SpaceReservationType.findAll({
      attributes: ['id', 'value'],
    });
  }

  static async getOneById(id: number) {
    return SpaceReservationType.findOne({
      where: {
        id,
      },
      rejectOnEmpty: true,
    });
  }
}
