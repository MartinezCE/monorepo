/* eslint-disable import/no-cycle */
import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';
import Space from './Space';

interface HourlySpaceHistoryAttributes {
  id?: number;
  previousHourlySpaceId: number;
  spaceId: number;
  price: number;
  dayOfWeek: number;
  halfDayPrice: number;
  fullDayPrice: number;
  minHoursAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HourlySpaceHistoryInput extends Optional<HourlySpaceHistoryAttributes, 'id'> {}
export interface HourlySpaceHistoryOuput extends Required<HourlySpaceHistoryAttributes> {}

class HourlySpaceHistory
  extends Model<HourlySpaceHistoryAttributes, HourlySpaceHistoryInput>
  implements HourlySpaceHistoryAttributes
{
  declare id: number;

  declare previousHourlySpaceId: number;

  declare spaceId: number;

  declare price: number;

  declare dayOfWeek: number;

  declare minHoursAmount: number;

  declare halfDayPrice: number;

  declare fullDayPrice: number;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

HourlySpaceHistory.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    previousHourlySpaceId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    halfDayPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fullDayPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    minHoursAmount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    dayOfWeek: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
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
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'hourlySpaceHistory',
    tableName: 'hourly_space_history',
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

export default HourlySpaceHistory;
