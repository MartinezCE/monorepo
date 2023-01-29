import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';

interface SpaceTypeAttributes {
  id?: number;
  value: 'SHARED' | 'MEETING_ROOM' | 'PRIVATE_OFFICE';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SpaceTypeInput extends Optional<SpaceTypeAttributes, 'id'> {}
export interface SpaceTypeOuput extends Required<SpaceTypeAttributes> {}

class SpaceType extends Model<SpaceTypeAttributes, SpaceTypeInput> implements SpaceTypeAttributes {
  declare id: number;

  declare value: 'SHARED' | 'MEETING_ROOM' | 'PRIVATE_OFFICE';

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

SpaceType.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'spaceType',
  }
);

export default SpaceType;
