/* eslint-disable import/no-cycle */
import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';
import { CreditOuput } from './Credits';

interface CurrencyAttributes {
  id?: number;
  value: string;
  credit?: CreditOuput;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CurrencyInput extends Optional<CurrencyAttributes, 'id'> {}
export interface CurrencyOuput extends Required<CurrencyAttributes> {}

class Currency extends Model<CurrencyAttributes, CurrencyInput> implements CurrencyAttributes {
  declare id: number;

  declare value: string;

  declare credit?: CreditOuput;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

Currency.init(
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
    modelName: 'currency',
    name: {
      plural: 'currencies',
      singular: 'currency',
    },
  }
);

export default Currency;
