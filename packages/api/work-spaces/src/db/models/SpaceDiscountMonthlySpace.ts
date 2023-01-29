import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';
import MonthlySpace from './MonthlySpace';
import SpaceDiscount from './SpaceDiscount';

interface MonthlySpaceDiscountAttributes {
  id?: number;
  spaceDiscountId?: number;
  monthlySpaceId?: number;
  percentage: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MonthlySpaceDiscountInput extends Optional<MonthlySpaceDiscountAttributes, 'id' | 'spaceDiscountId'> {}
export interface MonthlySpaceDiscountOuput extends Required<MonthlySpaceDiscountAttributes> {}

class SpaceDiscountMonthlySpace
  extends Model<MonthlySpaceDiscountAttributes, MonthlySpaceDiscountInput>
  implements MonthlySpaceDiscountAttributes
{
  declare id: number;

  declare spaceDiscountId: number;

  declare monthlySpaceId: number;

  declare percentage: number;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

SpaceDiscountMonthlySpace.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    spaceDiscountId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: SpaceDiscount,
        key: 'id',
      },
    },
    monthlySpaceId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: MonthlySpace,
        key: 'id',
      },
    },
    percentage: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'spaceDiscountMonthlySpace',
    tableName: 'space_discounts_monthly_spaces',
  }
);

export default SpaceDiscountMonthlySpace;
