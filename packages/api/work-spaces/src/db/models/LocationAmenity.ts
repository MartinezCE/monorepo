/* eslint-disable import/no-cycle */
import { DataTypes, Model, Optional } from 'sequelize';
import { AmenityAttributes } from '../../interfaces';
import database from '../database';
import Amenity from './Amenity';
import Location from './Location';

interface LocationAmenityAttributes extends AmenityAttributes {
  locationId?: number;
}

export interface LocationAmenityInput extends Optional<LocationAmenityAttributes, 'id' | 'amenityId' | 'locationId'> {}
export interface LocationAmenityOuput extends Required<LocationAmenityAttributes> {}

class LocationAmenity
  extends Model<LocationAmenityAttributes, LocationAmenityInput>
  implements LocationAmenityAttributes
{
  declare id: number;

  declare amenityId: number;

  declare locationId: number;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

LocationAmenity.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    locationId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Location,
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
      plural: 'locationsAmenities',
      singular: 'locationAmenity',
    },
    modelName: 'locationsAmenities',
  }
);

export default LocationAmenity;
