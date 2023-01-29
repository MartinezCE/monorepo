/* eslint-disable import/no-cycle */
import { DataTypes, Model, Optional } from 'sequelize';
import { AmenityAttributes } from '../../interfaces';
import database from '../database';
import Amenity from './Amenity';
import Space from './Space';

interface SpaceAmenityAttributes extends AmenityAttributes {
  spaceId?: number;
}

export interface AmenityInput extends Optional<SpaceAmenityAttributes, 'id' | 'amenityId' | 'spaceId'> {}
export interface AmenityOuput extends Required<SpaceAmenityAttributes> {}

class SpaceAmenity extends Model<SpaceAmenityAttributes, AmenityInput> implements SpaceAmenityAttributes {
  declare id: number;

  declare amenityId: number;

  declare spaceId: number;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

SpaceAmenity.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    amenityId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Amenity,
        key: 'id',
      },
    },
    spaceId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Space,
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
      plural: 'spacesAmenities',
      singular: 'spaceAmenity',
    },
    modelName: 'spacesAmenities',
  }
);

export default SpaceAmenity;
