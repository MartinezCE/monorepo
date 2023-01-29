import { DataTypes, Model, Optional } from 'sequelize';
import { AmenityAttributes } from '../../interfaces';
import database from '../database';
import Amenity from './Amenity';
import Blueprint from './Blueprint';
import User from './User';

interface UserAmenityAttributes extends AmenityAttributes {
  id: number;
  userId: number;
  amenityId: number;
  blueprintId: number;
}

export interface AmenityInput extends Optional<UserAmenityAttributes, 'id'> {}
export interface AmenityOuput extends Required<UserAmenityAttributes> {}

class UserAmenity extends Model<UserAmenityAttributes, AmenityInput> implements UserAmenityAttributes {
  declare id: number;

  declare userId: number;

  declare amenityId: number;

  declare blueprintId: number;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

UserAmenity.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
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
    blueprintId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Blueprint,
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
    sequelize: database,
    underscored: true,
    name: {
      plural: 'usersAmenities',
      singular: 'userAmenity',
    },
    modelName: 'usersAmenities',
  }
);

export default UserAmenity;
