/* eslint-disable import/no-cycle */
import { DataTypes, Model, Optional } from 'sequelize';
import { FileAttributes, FileTypes } from '../../interfaces';
import database from '../database';
import Location from './Location';

interface LocationFileAttributes extends FileAttributes {
  locationId?: number;
}

export interface LocationFileInput extends Optional<LocationFileAttributes, 'id' | 'locationId'> {}

class LocationFile extends Model<LocationFileAttributes, LocationFileInput> implements LocationFileAttributes {
  declare id: number;

  declare locationId: number;

  declare url: string;

  declare mimetype: string;

  declare name: string;

  declare key: string;

  declare type: FileTypes;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

LocationFile.init(
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
    type: {
      type: DataTypes.ENUM('IMAGE', 'DOCUMENT'),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mimetype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'locationFile',
  }
);

export default LocationFile;
