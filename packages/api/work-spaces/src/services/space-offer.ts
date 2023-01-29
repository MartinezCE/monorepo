import SpaceOffer from '../db/models/SpaceOffer';
import SpaceType from '../db/models/SpaceType';

export default class SpaceOfferService {
  static async getSpaceOffersBySpaceType(typeId: string) {
    return SpaceOffer.findAll({
      attributes: ['id', 'value'],
      include: [
        {
          model: SpaceType,
          required: true,
          attributes: [],
          through: {
            where: {
              spaceTypeId: typeId,
            },
          },
        },
      ],
    });
  }
}
