/* eslint-disable import/no-cycle */
import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';
import Company from './Company';

interface FeePercentageAttributes {
  id?: number;
  value: number;
  companyId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FeePercentageInput extends Optional<FeePercentageAttributes, 'id'> {}
export interface FeePercentageOuput extends Required<FeePercentageAttributes> {}

class FeePercentage extends Model<FeePercentageAttributes, FeePercentageInput> implements FeePercentageAttributes {
  declare id: number;

  declare value: number;

  declare companyId: number;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

FeePercentage.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    value: {
      allowNull: false,
      type: DataTypes.DECIMAL(3, 2),
    },
    companyId: {
      allowNull: false,
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Company,
        key: 'id',
      },
    },
  },
  {
    paranoid: true,
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'feePercentages',
  }
);

export default FeePercentage;
