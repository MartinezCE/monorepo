/* eslint-disable import/no-cycle */
import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';
import Currency from './Currency';

interface CountryAttributes {
  id?: number;
  name: string;
  iso3: string;
  currencyId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CountryInput extends Optional<CountryAttributes, 'id'> {}
export interface CountryOuput extends Required<CountryAttributes> {}

class Country extends Model<CountryAttributes, CountryInput> implements CountryAttributes {
  declare id: number;

  declare name: string;

  declare iso3: string;

  declare currencyId: number;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

Country.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    iso3: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currencyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Currency,
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'country',
  }
);

export default Country;
