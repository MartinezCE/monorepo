import { Transaction } from 'sequelize';
import WPMReservationType, { WPMReservationTypes } from '../db/models/WPMReservationType';

class WPMReservationTypeService {
  reservationTypes: WPMReservationType[];

  async getReservationTypes(transaction?: Transaction) {
    this.reservationTypes = this.reservationTypes ?? (await WPMReservationType.findAll({ transaction }));
    return this.reservationTypes;
  }

  async findByName(name: WPMReservationTypes, transaction?: Transaction) {
    const reservationTypes = await this.getReservationTypes(transaction);
    return reservationTypes.find(type => type.name === name);
  }
}

export default new WPMReservationTypeService();
