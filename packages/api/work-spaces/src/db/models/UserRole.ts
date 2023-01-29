import { DataTypes, Model, Optional } from 'sequelize';
import { UserRoleEnum } from '../../common/enum/user';
import database from '../database';

export type UserRoles = 'ACCOUNT_MANAGER' | 'TEAM_MANAGER' | 'MEMBER';

interface UserRoleAttributes {
  id?: number;
  value: UserRoleEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserRoleInput extends Optional<UserRoleAttributes, 'id'> {}
export interface UserRoleOuput extends Required<UserRoleAttributes> {}

class UserRole extends Model<UserRoleAttributes, UserRoleInput> implements UserRoleAttributes {
  declare id: number;

  declare value: UserRoleEnum;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

UserRole.init(
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
    modelName: 'userRole',
  }
);

export default UserRole;
