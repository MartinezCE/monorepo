import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';

interface SpaceDepositAttributes {
  id?: number;
  monthsAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SpaceDepositInput extends Optional<SpaceDepositAttributes, 'id'> {}
export interface SpaceDepositOuput extends Required<SpaceDepositAttributes> {}

class SpaceDeposit extends Model<SpaceDepositAttributes, SpaceDepositInput> implements SpaceDepositAttributes {
  declare id: number;

  declare monthsAmount: number;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

SpaceDeposit.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    monthsAmount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'spaceDeposit',
  }
);

export default SpaceDeposit;
