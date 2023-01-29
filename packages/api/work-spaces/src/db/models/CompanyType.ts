import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';

interface CompanyTypeAttributes {
  id?: number;
  value: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CompanyTypeInput extends Optional<CompanyTypeAttributes, 'id'> {}
export interface CompanyTypeOuput extends Required<CompanyTypeAttributes> {}

class CompanyType extends Model<CompanyTypeAttributes, CompanyTypeInput> implements CompanyTypeAttributes {
  declare id: number;

  declare value: string;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

CompanyType.init(
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
    modelName: 'companyType',
  }
);

export default CompanyType;
