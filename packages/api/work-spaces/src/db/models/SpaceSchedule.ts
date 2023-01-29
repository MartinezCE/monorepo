import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';
import Space from './Space';

interface SpaceScheduleAttributes {
  id?: number;
  spaceId?: number;
  dayOfWeek: number;
  openTime: number;
  closeTime: number;
  is24Open: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SpaceScheduleInput extends Optional<SpaceScheduleAttributes, 'id' | 'spaceId'> {}
export interface SpaceScheduleOuput extends Required<SpaceScheduleAttributes> {}

class SpaceSchedule extends Model<SpaceScheduleAttributes, SpaceScheduleInput> implements SpaceScheduleAttributes {
  declare id: number;

  declare spaceId: number;

  declare dayOfWeek: number;

  declare openTime: number;

  declare closeTime: number;

  declare is24Open: boolean;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

SpaceSchedule.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    dayOfWeek: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    openTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    closeTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    is24Open: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    modelName: 'spaceSchedule',
    scopes: {
      bySpace(spaceId) {
        return {
          where: {
            spaceId,
          },
        };
      },
    },
  }
);

export default SpaceSchedule;
