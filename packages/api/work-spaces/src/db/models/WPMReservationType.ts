import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';

export enum WPMReservationTypes {
  DAYPASS = 'DAYPASS',
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  CUSTOM = 'CUSTOM',
}

interface WPMReservationTypeAttributes {
  id?: number;
  name: WPMReservationTypes;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WPMReservationTypeInput extends Optional<WPMReservationTypeAttributes, 'id'> {}
export interface WPMReservationTypeOuput extends Required<WPMReservationTypeAttributes> {}

class WPMReservationType
  extends Model<WPMReservationTypeAttributes, WPMReservationTypeInput>
  implements WPMReservationTypeAttributes
{
  declare id: number;

  declare name: WPMReservationTypes;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

WPMReservationType.init(
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
  },
  {
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'WPMReservationType',
    tableName: 'wpm_reservation_types',
  }
);

export default WPMReservationType;
