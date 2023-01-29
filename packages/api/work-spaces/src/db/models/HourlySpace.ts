import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';
import Space from './Space';

interface HourlySpaceAttributes {
  id?: number;
  spaceId?: number;
  price: number;
  dayOfWeek: number;
  halfDayPrice: number;
  fullDayPrice: number;
  minHoursAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HourlySpaceInput extends Optional<HourlySpaceAttributes, 'id' | 'spaceId'> {}
export interface HourlySpaceOuput extends Required<HourlySpaceAttributes> {}

class HourlySpace extends Model<HourlySpaceAttributes, HourlySpaceInput> implements HourlySpaceAttributes {
  declare id: number;

  declare spaceId: number;

  declare price: number;

  declare dayOfWeek: number;

  declare minHoursAmount: number;

  declare halfDayPrice: number;

  declare fullDayPrice: number;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

HourlySpace.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
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
    modelName: 'hourlySpace',
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

export default HourlySpace;
