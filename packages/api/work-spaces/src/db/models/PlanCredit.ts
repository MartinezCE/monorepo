/* eslint-disable import/no-cycle */
import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';
import Credits from './Credits';
import Plan from './Plan';

interface PlanCreditAttributes {
  id?: number;
  planId: number;
  creditId: number;
  value: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface CreditInput extends Optional<PlanCreditAttributes, 'id'> {}
export interface CreditOuput extends Required<PlanCreditAttributes> {}

class PlanCredit extends Model<PlanCreditAttributes, CreditInput> implements PlanCreditAttributes {
  declare id: number;

  declare planId: number;

  declare creditId: number;

  declare value: number;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  declare readonly deletedAt: Date;
}

PlanCredit.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    planId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Plan,
        key: 'id',
      },
    },
    creditId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Credits,
        key: 'id',
      },
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    paranoid: true,
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'planCredit',
  }
);

export default PlanCredit;
