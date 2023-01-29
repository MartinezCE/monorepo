/* eslint-disable import/no-cycle */
import {
  BelongsToManyCountAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  HasManyAddAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManySetAssociationsMixin,
  Model,
  Op,
  Optional,
  Sequelize,
} from 'sequelize';
import bcrypt from 'bcrypt';
import database from '../database';
import Company from './Company';
import UserType, { UserTypeOuput } from './UserType';
import State from './State';
import UserRole, { UserRoleOuput } from './UserRole';
import Blueprint from './Blueprint';
import Country from './Country';
import Plan from './Plan';
import Amenity from './Amenity';
import { ModelTimestamps } from '../../interfaces';
import HourlySpaceReservation from './HourlySpaceReservation';
import WPMReservation from './WPMReservation';

export type AuthProvidersName = 'google';

type AuthProviders = {
  [k in AuthProvidersName]?: {
    profileId: string;
    refreshToken: string;
  };
};

export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

export interface UserAttributes extends ModelTimestamps {
  id: number;
  firstName: string;
  lastName: string;
  password?: string;
  phoneNumber: string;
  email: string;
  isWimetAdmin?: boolean; // TODO: Change this to an user type & role
  companyRole: string;
  isWPMEnabled?: boolean;
  userTypeId: number;
  status?: UserStatus;
  userType?: UserTypeOuput;
  companies?: Company[];
  userRoleId?: number;
  userRole?: UserRoleOuput;
  authProviders?: AuthProviders;
  avatarUrl?: string;
  avatarKey?: string;
  amenities?: Amenity[];
  createdAt?: Date;
  updatedAt?: Date;
  validatePassword?: (passowrd: string, b: string) => Promise<boolean>;
}

export interface UserInput
  extends Optional<
    UserAttributes,
    | 'id'
    | 'validatePassword'
    | 'companyRole'
    | 'isWPMEnabled'
    | 'userRole'
    | 'userTypeId'
    | 'avatarUrl'
    | 'avatarKey'
    | 'companies'
  > {}
export interface UserOuput extends Required<UserAttributes> {}

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
  declare id: number;

  declare firstName: string;

  declare lastName: string;

  declare password: string;

  declare phoneNumber: string;

  declare email: string;

  declare isWimetAdmin?: boolean;

  declare userTypeId: number;

  declare status?: UserStatus;

  declare companyRole: string;

  declare isWPMEnabled?: boolean;

  declare userType: UserTypeOuput;

  declare userRoleId: number;

  declare userRole: UserRoleOuput;

  declare authProviders: AuthProviders;

  declare avatarUrl: string;

  declare avatarKey: string;

  declare companies: Company[];

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  declare readonly deletedAt: Date;

  declare blueprints: Blueprint[];

  declare createCompany: HasManyCreateAssociationMixin<Company>;

  declare addCompany: HasManyAddAssociationsMixin<Company, number>;

  declare removeCompany: HasManyRemoveAssociationMixin<Company, number>;

  declare setCompanies: HasManySetAssociationsMixin<Company, number>;

  declare getCompanies: HasManyGetAssociationsMixin<Company>;

  declare setBlueprints: HasManySetAssociationsMixin<Blueprint, number>;

  declare getBlueprints: HasManyGetAssociationsMixin<Blueprint>;

  declare setWPMReservations: HasManySetAssociationsMixin<WPMReservation, number>;

  declare getWPMReservations: HasManyGetAssociationsMixin<WPMReservation>;

  declare setHourlySpaceReservations: HasManySetAssociationsMixin<HourlySpaceReservation, number>;

  declare getHourlySpaceReservations: HasManyGetAssociationsMixin<HourlySpaceReservation>;

  declare setPlans: BelongsToManySetAssociationsMixin<Plan, number>;

  declare getPlans: HasManyGetAssociationsMixin<Plan>;

  declare setUserRole: BelongsToSetAssociationMixin<UserRole, number>;

  declare hasBlueprint: BelongsToManyHasAssociationMixin<Blueprint, number>;

  declare setAmenities: BelongsToManySetAssociationsMixin<Amenity, number>;

  declare countAmenities: BelongsToManyCountAssociationsMixin;

  validatePassword(password: string) {
    return bcrypt.compare(password, this.getDataValue('password'));
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'email',
    },
    isWimetAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userTypeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: UserType,
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED'),
      allowNull: true,
    },
    companyRole: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isWPMEnabled: {
      field: 'is_wpm_enabled',
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    userRoleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: UserRole,
        key: 'id',
      },
    },
    authProviders: {
      type: DataTypes.JSON,
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
    modelName: 'user',
    paranoid: true,
    scopes: {
      mainContext() {
        return {
          include: [
            { model: Company.scope('withFeePercentage'), include: [{ model: State, include: [Country] }] },
            Plan,
            UserType,
            UserRole,
          ],
        };
      },
      byCompany(companyId) {
        return {
          include: [
            UserRole,
            {
              model: Company,
              attributes: [],
              where: { id: companyId },
            },
          ],
        };
      },
      byAmenity(amenityId) {
        return {
          include: [
            {
              model: Amenity,
              attributes: [],
              where: { id: amenityId },
            },
          ],
        };
      },
      byPlan(planId) {
        return {
          include: [
            {
              model: Plan,
              required: true,
              where: { id: planId },
            },
          ],
        };
      },
      filterByPlans(havePlans: boolean) {
        return {
          include: [{ model: Plan, through: { attributes: [] } }],
          group: ['id', 'plans.id'],
          having: Sequelize.where(Sequelize.fn('COUNT', Sequelize.col('plans.id')), {
            [havePlans ? Op.gt : Op.eq]: 0,
          }),
        };
      },
    },
    hooks: {
      async beforeCreate(user) {
        await new Promise(resolve => {
          bcrypt.hash(user.getDataValue('password'), 10, (_, hash) => {
            user.setDataValue('password', hash);
            resolve({});
          });
        });
      },
      async beforeUpdate(user) {
        if (user.changed('password')) {
          await new Promise(resolve => {
            bcrypt.hash(user.getDataValue('password'), 10, (_, hash) => {
              user.setDataValue('password', hash);
              resolve({});
            });
          });
        }
      },
    },
  }
);

export default User;
