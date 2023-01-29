import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';
import Company from './Company';
import Plan from './Plan';
import User from './User';
import UserRole from './UserRole';

interface ClientInvitationAttributes {
  id?: number;
  companyId: number;
  userId: number;
  toEmail: string;
  firstName?: string;
  lastName?: string;
  roleId?: number;
  planId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface ClientInvitationInput extends Optional<ClientInvitationAttributes, 'id' | 'roleId' | 'planId'> {}
export interface ClientInvitationOuput extends Required<ClientInvitationAttributes> {}

class ClientInvitation
  extends Model<ClientInvitationAttributes, ClientInvitationInput>
  implements ClientInvitationAttributes
{
  declare id: number;

  declare companyId: number;

  declare userId: number;

  declare toEmail: string;

  declare firstName: string;

  declare lastName: string;

  declare roleId: number;

  declare planId: number;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  declare readonly deletedAt: Date;
}

ClientInvitation.init(
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
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    toEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    roleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: UserRole,
        key: 'id',
      },
    },
    planId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: Plan,
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'client-invitation',
    paranoid: true,
  }
);

export default ClientInvitation;
