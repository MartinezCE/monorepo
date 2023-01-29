import { Op, Transaction } from 'sequelize';
import Floor, { FloorAttributes, FloorInput } from '../db/models/Floor';
import { FloorDTO } from '../dto/floor';
import LocationService from './location';

export default class FloorService {
  static async destroyNotInByUser(floors: FloorDTO[], userId: number, locationId: number, transaction?: Transaction) {
    const floorsToDelete = await Floor.scope([
      { method: ['byUser', userId] },
      { method: ['byLocation', locationId] },
    ]).findAll({
      where: {
        id: {
          [Op.notIn]: floors.map(f => f.id || -1),
        },
      },
      attributes: ['id'],
      transaction,
    });

    return Floor.destroy({
      where: {
        id: floorsToDelete.map(f => f.id),
        locationId,
      },
      transaction,
    });
  }

  static async bulkUpsert(floors: FloorDTO[], locationId: number, transaction?: Transaction) {
    const updateOnDuplicate: Exclude<keyof FloorAttributes, 'id' | 'locationId'>[] = ['number'];
    const parsedFloors = floors.map(({ blueprints, ...restFloor }) => ({ ...restFloor, locationId }));

    return Floor.bulkCreate(parsedFloors, { updateOnDuplicate, transaction });
  }

  static async createLocationFloor(
    userId: number,
    locationId: number,
    payload: Omit<FloorInput, 'locationId'>,
    transaction?: Transaction
  ) {
    const location = await LocationService.findOneByUser(userId, locationId, transaction);

    return Floor.create(
      {
        ...payload,
        locationId: location.id,
      },
      { transaction }
    );
  }

  static async findOneByUser(userId: number, floorId: number, transaction?: Transaction) {
    return Floor.scope({ method: ['byUser', userId] }).findOne({
      where: {
        id: floorId,
      },
      transaction,
      rejectOnEmpty: true,
    });
  }

  static async findOneByLocationAndName(locationId: number, name: string, transaction?: Transaction) {
    return Floor.scope({ method: ['byLocation', locationId] }).findOne({
      where: { number: name },
      transaction,
    });
  }

  static async findOrCreateByLocationAndName(locationId: number, floorName: string, transaction?: Transaction) {
    let floor = await FloorService.findOneByLocationAndName(locationId, floorName);
    if (!floor) {
      [floor] = await FloorService.bulkUpsert([{ locationId, number: floorName }], locationId, transaction);
    }

    return floor;
  }
}
