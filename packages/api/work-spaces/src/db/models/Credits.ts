/* eslint-disable import/no-cycle */
import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';
import Company from './Company';
import Country from './Country';
import Currency from './Currency';
import State from './State';

interface CreditsAttributes {
  id?: number;
  value: number;
  currencyId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreditInput extends Optional<CreditsAttributes, 'id'> {}
export interface CreditOuput extends Required<CreditsAttributes> {}

class Credits extends Model<CreditsAttributes, CreditInput> implements CreditsAttributes {
  declare id: number;

  declare value: number;

  declare currencyId: number;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

Credits.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
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
    paranoid: true,
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'credit',
    scopes: {
      byCompany(companyId: number) {
        return {
          include: [
            {
              model: Currency,
              required: true,
              attributes: [],
              include: [
                {
                  model: Country,
                  required: true,
                  attributes: ['id'],
                  include: [
                    {
                      model: State,
                      required: true,
                      attributes: [],
                      include: [
                        {
                          model: Company,
                          required: true,
                          attributes: [],
                          where: { id: companyId },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        };
      },
    },
  }
);

export default Credits;
