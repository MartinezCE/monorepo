/* eslint-disable import/no-cycle */
import { DataTypes, Model, Optional } from 'sequelize';
import { AmenityAttributes } from '../../interfaces';
import database from '../database';
import Amenity from './Amenity';
import Seat from './Seat';

interface SeatAmenityAttributes extends AmenityAttributes {
  seatId?: number;
}

export interface AmenityInput extends Optional<SeatAmenityAttributes, 'id'> {}
export interface AmenityOuput extends Required<SeatAmenityAttributes> {}

class SeatAmenity extends Model<SeatAmenityAttributes, AmenityInput> implements SeatAmenityAttributes {
  declare id: number;

  declare seatId: number;

  declare amenityId: number;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

SeatAmenity.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    seatId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Seat,
        key: 'id',
      },
    },
    amenityId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Amenity,
        key: 'id',
      },
    },
  },
  {
    paranoid: true,
    timestamps: true,
    sequelize: database,
    underscored: true,
    name: {
      plural: 'seatsAmenities',
      singular: 'seatAmenity',
    },
    modelName: 'seatsAmenities',
  }
);

export default SeatAmenity;
