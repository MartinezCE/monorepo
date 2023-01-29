import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';

interface SpaceReservationTypeAttributes {
  id?: number;
  value: 'HOURLY' | 'MONTHLY';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SpaceReservationTypeInput extends Optional<SpaceReservationTypeAttributes, 'id'> {}
export interface SpaceReservationTypeOuput extends Required<SpaceReservationTypeAttributes> {}

class SpaceReservationType
  extends Model<SpaceReservationTypeAttributes, SpaceReservationTypeInput>
  implements SpaceReservationTypeAttributes
{
  declare id: number;

  declare value: 'HOURLY' | 'MONTHLY';

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

SpaceReservationType.init(
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
    modelName: 'spaceReservationType',
  }
);

export default SpaceReservationType;
