import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';
import Company from './Company';

interface CompanyFormAttributes {
  id: number;
  companyId: number;
  formId: string;
  formLink: string;
  formName: string;
}

export interface CompanyFormInput extends Optional<CompanyFormAttributes, 'id'> {}
export interface CompanyFormOutput extends Required<CompanyFormAttributes> {}

class CompanyForm extends Model<CompanyFormAttributes, CompanyFormInput> implements CompanyFormAttributes {
  declare id: number;

  declare companyId: number;

  declare formId: string;

  declare formLink: string;

  declare formName: string;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  declare readonly deletedAt: Date;
}

CompanyForm.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    companyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Company,
        key: 'id',
      },
    },
    formId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    formLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    formName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    timestamps: true,
    sequelize: database,
    underscored: true,
    name: {
      plural: 'companiesForms',
      singular: 'companyForm',
    },
    modelName: 'companiesForms',
    scopes: {
      byCompany(companyId) {
        return {
          include: [
            {
              model: Company,
              attributes: ['name'],
              where: { id: companyId },
            },
          ],
          raw: true,
        };
      },
    },
  }
);

export default CompanyForm;
