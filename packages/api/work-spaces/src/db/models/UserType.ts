import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';

export enum UserTypes {
  PARTNER = 'PARTNER',
  CLIENT = 'CLIENT',
}

interface UserTypeAttributes {
  id?: number;
  value: UserTypes;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserTypeInput extends Optional<UserTypeAttributes, 'id'> {}
export interface UserTypeOuput extends Required<UserTypeAttributes> {}

class UserType extends Model<UserTypeAttributes, UserTypeInput> implements UserTypeAttributes {
  declare id: number;

  declare value: UserTypes;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

UserType.init(
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
    modelName: 'userType',
  }
);

export default UserType;
