import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';

interface SpaceOfferAttributes {
  id?: number;
  value: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SpaceOfferInput extends Optional<SpaceOfferAttributes, 'id'> {}
export interface SpaceOfferOuput extends Required<SpaceOfferAttributes> {}

class SpaceOffer extends Model<SpaceOfferAttributes, SpaceOfferInput> implements SpaceOfferAttributes {
  declare id: number;

  declare value: string;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

SpaceOffer.init(
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
    modelName: 'spaceOffer',
  }
);

export default SpaceOffer;
