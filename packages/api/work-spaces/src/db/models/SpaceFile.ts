/* eslint-disable import/no-cycle */
import { DataTypes, Model, Optional } from 'sequelize';
import { FileAttributes, FileTypes } from '../../interfaces';
import database from '../database';
import Space from './Space';

interface SpaceFileAttributes extends FileAttributes {
  spaceId?: number;
}

export interface SpaceFileInput extends Optional<SpaceFileAttributes, 'id' | 'spaceId'> {}

class SpaceFile extends Model<SpaceFileAttributes, SpaceFileInput> implements SpaceFileAttributes {
  declare id: number;

  declare spaceId: number;

  declare url: string;

  declare mimetype: string;

  declare name: string;

  declare key: string;

  declare type: FileTypes;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

SpaceFile.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    spaceId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Space,
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
    modelName: 'spaceFile',
  }
);

export default SpaceFile;
