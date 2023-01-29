import { DataTypes, Model, Optional, HasManyAddAssociationsMixin } from 'sequelize';
import database from '../database';
import Space from './Space';
import SpaceDeposit from './SpaceDeposit';
import SpaceDiscount from './SpaceDiscount';

interface MonthlySpaceAttributes {
  id?: number;
  spaceId?: number;
  price: number;
  minMonthsAmount: number;
  maxMonthsAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MonthlySpaceInput extends Optional<MonthlySpaceAttributes, 'id' | 'spaceId'> {}
export interface MonthlySpaceOuput extends Required<MonthlySpaceAttributes> {}

class MonthlySpace extends Model<MonthlySpaceAttributes, MonthlySpaceInput> implements MonthlySpaceAttributes {
  declare id: number;

  declare spaceId: number;

  declare price: number;

  declare minMonthsAmount: number;

  declare maxMonthsAmount: number;

  declare readonly createdAt: Date;

  declare setSpaceDeposits: HasManyAddAssociationsMixin<SpaceDeposit, number>;

  declare setSpaceDiscounts: HasManyAddAssociationsMixin<SpaceDiscount, number>;

  declare readonly updatedAt: Date;
}

MonthlySpace.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    minMonthsAmount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    maxMonthsAmount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
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
    modelName: 'monthlySpace',
    scopes: {
      bySpace(spaceId) {
        return {
          where: {
            spaceId,
          },
          include: [
            {
              model: SpaceDiscount,
              attributes: ['id', 'monthsAmount'],
              through: {
                attributes: ['percentage'],
              },
            },
            {
              model: SpaceDeposit,
              attributes: ['id', 'monthsAmount'],
              through: {
                attributes: [],
              },
            },
          ],
        };
      },
    },
  }
);

export default MonthlySpace;
