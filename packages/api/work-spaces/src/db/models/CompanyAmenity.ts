/* eslint-disable import/no-cycle */
import { DataTypes, Model, Optional } from 'sequelize';
import { AmenityAttributes } from '../../interfaces';
import database from '../database';
import Amenity from './Amenity';
import Company from './Company';
import Seat from './Seat';

interface CompanyAmenityAttributes extends AmenityAttributes {
  companyId: number;
  seats?: Seat[];
}

export interface CompanyAmenityInput extends Optional<CompanyAmenityAttributes, 'id'> {}
export interface CompanyAmenityOuput extends Required<CompanyAmenityAttributes> {}

class CompanyAmenity extends Model<CompanyAmenityAttributes, CompanyAmenityInput> implements CompanyAmenityAttributes {
  declare id: number;

  declare companyId: number;

  declare amenityId: number;

  declare seats?: Seat[];

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

CompanyAmenity.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Company,
        key: 'id',
      },
    },
    amenityId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Amenity,
        key: 'id',
      },
    },
  },
  {
    paranoid: true,
    timestamps: true,
    sequelize: database,
    underscored: true,
    name: {
      plural: 'companiesAmenities',
      singular: 'companyAmenity',
    },
    modelName: 'companiesAmenities',
  }
);

export default CompanyAmenity;
