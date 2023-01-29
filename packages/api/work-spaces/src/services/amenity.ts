import { isUndefined, uniqBy } from 'lodash';
import { FindOptions, Op } from 'sequelize';
import { Model, ModelStatic, Transaction, WhereOptions } from 'sequelize/dist';
import Amenity, { AmenityTypes, AmenityAttributes } from '../db/models/Amenity';
import { AmenityAttributes as GenericAmenityAttributes } from '../interfaces';

export default class AmenityService {
  static async findOrCreateAmenity(name: string, transaction?: Transaction) {
    return Amenity.findOrCreate({
      where: {
        name,
      },
      transaction,
    });
  }

  static async addAmenity<
    T extends Model<GenericAmenityAttributes, GenericAmenityAttributes> & GenericAmenityAttributes
  >(model: ModelStatic<T>, id: number, where: Partial<WhereOptions<T['_attributes']>>, transaction?: Transaction) {
    const [amenity] = await model.findOrCreate({
      include: [Amenity],
      where: {
        amenityId: id,
        ...where,
      },
      transaction,
    });

    return amenity.reload({ transaction });
  }

  static async removeAmenity<
    T extends Model<GenericAmenityAttributes, GenericAmenityAttributes> & GenericAmenityAttributes
  >(model: ModelStatic<T>, id: number, where: Partial<WhereOptions<T['_attributes']>>) {
    return model.destroy({
      where: {
        amenityId: id,
        ...where,
      },
    });
  }

  static async findAllByType(_type: AmenityTypes | AmenityTypes[]) {
    const type = _type ? { type: _type } : {};

    const amenities = await Amenity.findAll({
      where: {
        [Op.and]: [
          {
            isDefault: true,
          },
          type,
        ],
      },
    });

    return AmenityService.groupByType(amenities);
  }

  static groupOne(obj: object, key: string, value: unknown) {
    obj[key] = obj[key] || [];
    obj[key].push(value);
    return obj;
  }

  static groupByType<T extends Model<AmenityAttributes, AmenityAttributes> & AmenityAttributes>(amenities: T[]) {
    return amenities.reduce((acc, el) => AmenityService.groupOne(acc, el.type, el), {});
  }

  static async findAllFromSeatsOfCompany(
    companyId: number,
    blueprintId?: number,
    options?: FindOptions<AmenityAttributes>
  ) {
    return Amenity.scope([
      { method: ['bySeatCompany', companyId] },
      ...(!isUndefined(blueprintId) ? [{ method: ['byBlueprint', blueprintId] as [string, number] }] : []),
    ]).findAll(options);
  }

  static async findAllFromCompany(companyId: number, options?: FindOptions<AmenityAttributes>) {
    return Amenity.scope([{ method: ['byCompany', companyId] }]).findAll(options);
  }

  static getAmenitiesWithBlueprints(amenities: Amenity[]) {
    return amenities.map(amenity => {
      const { seats, ...rest } = amenity.toJSON();
      return {
        ...rest,
        blueprints: uniqBy(
          seats.map(s => s.blueprint),
          b => b.id
        ),
      };
    });
  }
}
