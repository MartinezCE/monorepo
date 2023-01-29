/* eslint-disable import/no-cycle */
import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';

export enum PlanTypes {
  CUSTOM = 'CUSTOM',
  ENTERPRISE = 'ENTERPRISE',
}
// TODO: Add plan price? price related to Currency? add price discounts?
interface PlanTypeAttributes {
  id?: number;
  name: PlanTypes;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PlanTypeInput extends Optional<PlanTypeAttributes, 'id'> {}
export interface PlanTypeOuput extends Required<PlanTypeAttributes> {}

class PlanType extends Model<PlanTypeAttributes, PlanTypeInput> implements PlanTypeAttributes {
  declare id: number;

  declare name: PlanTypes;

  declare initialCredits: number;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

PlanType.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.ENUM(...Object.values(PlanTypes)),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'planType',
  }
);

export default PlanType;
