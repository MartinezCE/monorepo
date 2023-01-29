import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';

interface SpaceDiscountAttributes {
  id?: number;
  monthsAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SpaceDiscountInput extends Optional<SpaceDiscountAttributes, 'id'> {}
export interface SpaceDiscountOuput extends Required<SpaceDiscountAttributes> {}

class SpaceDiscount extends Model<SpaceDiscountAttributes, SpaceDiscountInput> implements SpaceDiscountAttributes {
  declare id: number;

  declare monthsAmount: number;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

SpaceDiscount.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    monthsAmount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'spaceDiscount',
  }
);

export default SpaceDiscount;
