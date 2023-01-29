/* eslint-disable import/no-cycle */
import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';
import Blueprint from './Blueprint';
import CompanyType from './CompanyType';
import FeePercentage from './FeePercentage';
import Floor from './Floor';
import Location from './Location';
import Seat from './Seat';
import State from './State';
import User, { AuthProvidersName } from './User';
import UserRole from './UserRole';

export type AdminAuthProviders = {
  [k in AuthProvidersName]?: {
    profileId: string;
    refreshToken: string;
  }[];
};

export interface CompanyAttributes {
  id: number;
  adminProviders?: AdminAuthProviders;
  stateId: number;
  tz: string;
  companyTypeId: number;
  name: string;
  address: string;
  zipCode: string;
  businessName: string;
  taxNumber: string;
  peopleAmount: number;
  websiteUrl: string;
  users?: User[];
  feePercentage?: FeePercentage | null;
  avatarUrl?: string;
  avatarKey?: string;
}

export interface CompanyInput
  extends Optional<
    CompanyAttributes,
    | 'id'
    | 'stateId'
    | 'companyTypeId'
    | 'address'
    | 'zipCode'
    | 'businessName'
    | 'taxNumber'
    | 'peopleAmount'
    | 'websiteUrl'
    | 'avatarUrl'
    | 'avatarKey'
  > {}
export interface CompanyOuput
  extends Required<Omit<CompanyAttributes, 'feePercentage'>>,
    Pick<CompanyAttributes, 'feePercentage'> {}

class Company extends Model<CompanyAttributes, CompanyInput> implements CompanyAttributes {
  declare id: number;

  declare adminProviders?: AdminAuthProviders;

  declare stateId: number;

  declare tz: string;

  declare companyTypeId: number;

  declare name: string;

  declare address: string;

  declare zipCode: string;

  declare businessName: string;

  declare taxNumber: string;

  declare peopleAmount: number;

  declare websiteUrl: string;

  declare avatarUrl: string;

  declare avatarKey: string;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

Company.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    adminProviders: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    stateId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: State,
        key: 'id',
      },
    },
    tz: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'UTC',
    },
    companyTypeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: CompanyType,
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'name',
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    taxNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    peopleAmount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    websiteUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatarUrl: {
      type: DataTypes.STRING,
    },
    avatarKey: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    sequelize: database,
    underscored: true,
    paranoid: true,
    modelName: 'company',
    name: {
      singular: 'company',
      plural: 'companies',
    },
    scopes: {
      byUser(userId) {
        return {
          include: [
            {
              model: User,
              attributes: [],
              required: true,
              where: {
                id: userId,
              },
            },
          ],
        };
      },
      byUserRole(userRoleValue) {
        return {
          include: [
            {
              model: User,
              attributes: [],
              required: true,
              include: [
                {
                  model: UserRole,
                  attributes: [],
                  required: true,
                  where: {
                    value: userRoleValue,
                  },
                },
              ],
            },
          ],
        };
      },
      byBlueprint(blueprintId: number) {
        return {
          include: [
            {
              model: Location,
              attributes: [],
              required: true,
              include: [
                {
                  model: Floor,
                  attributes: [],
                  required: true,
                  include: [
                    {
                      model: Blueprint,
                      attributes: [],
                      required: true,
                      where: { id: blueprintId },
                    },
                  ],
                },
              ],
            },
          ],
        };
      },
      withFeePercentage() {
        return {
          include: [
            {
              model: FeePercentage,
              attributes: ['value'],
            },
          ],
        };
      },
      bySeat(seatId: number) {
        return {
          include: [
            {
              model: Location,
              attributes: [],
              required: true,
              include: [
                {
                  model: Floor,
                  attributes: [],
                  required: true,
                  include: [
                    {
                      model: Blueprint,
                      attributes: [],
                      required: true,
                      include: [
                        {
                          model: Seat,
                          attributes: [],
                          required: true,
                          where: { id: seatId },
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

export default Company;
