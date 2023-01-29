/* eslint-disable import/no-cycle */
import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';
import Country, { CountryOuput } from './Country';

interface StateAttributes {
  id?: number;
  countryId?: number;
  country?: CountryOuput;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StateInput extends Optional<StateAttributes, 'id' | 'countryId'> {}
export interface StateOuput extends Required<StateAttributes> {}

class State extends Model<StateAttributes, StateInput> implements StateAttributes {
  declare id: number;

  declare countryId: number;

  declare country: CountryOuput;

  declare name: string;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

State.init(
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
    countryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Country,
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'state',
    scopes: {
      byCountry(countryId: number) {
        return { where: { countryId }, include: [Country] };
      },
    },
  }
);

export default State;
