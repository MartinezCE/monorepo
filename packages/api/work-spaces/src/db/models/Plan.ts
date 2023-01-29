/* eslint-disable import/no-cycle */
import { isArray } from 'lodash';
import {
  BelongsToManySetAssociationsMixin,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCreateAssociationMixin,
  HasManyRemoveAssociationMixin,
  Model,
  Optional,
} from 'sequelize';
import database from '../database';
import Company from './Company';
import Country from './Country';
import Currency from './Currency';
import HourlySpaceReservation from './HourlySpaceReservation';
import PlanRenovation from './PlanRenovation';
import PlanType from './PlanType';
import User from './User';

export enum PlanStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  PAUSED = 'PAUSED',
}

interface PlanAttributes {
  id?: number;
  companyId: number;
  name: string;
  planTypeId: number;
  countryId: number;
  maxPersonalCredits: number;
  maxReservationCredits: number;
  startDate: string;
  status?: PlanStatus;
  planRenovations?: PlanRenovation[];
  isDeletable?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PlanInput extends Optional<PlanAttributes, 'id' | 'status'> {}
export interface PlanOuput extends Required<PlanAttributes> {}

class Plan extends Model<PlanAttributes, PlanInput> implements PlanAttributes {
  declare id: number;

  declare companyId: number;

  declare company?: Company;

  declare name: string;

  declare planTypeId: number;

  declare countryId: number;

  declare maxPersonalCredits: number;

  declare maxReservationCredits: number;

  declare startDate: string;

  declare status?: PlanStatus;

  declare planRenovations?: PlanRenovation[];

  declare country?: Country;

  declare readonly isDeletable?: boolean;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  declare addUser: HasManyAddAssociationMixin<User, number>;

  declare removeUser: HasManyRemoveAssociationMixin<User, number>;

  declare setUsers: BelongsToManySetAssociationsMixin<User, number>;

  declare createPlanRenovation: HasManyCreateAssociationMixin<PlanRenovation>;
}

const applyIsDeletable = p => {
  if (p?.dataValues) {
    p.dataValues = {
      ...p.dataValues,
      isDeletable: !p?.planRenovations?.some(r => !!r?.hourlySpaceReservations?.length),
    };
  }
  return p;
};

Plan.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    planTypeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: PlanType,
        key: 'id',
      },
    },
    countryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Country,
        key: 'id',
      },
    },
    maxPersonalCredits: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    maxReservationCredits: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(PlanStatus)),
      allowNull: false,
      defaultValue: PlanStatus.PENDING,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: database,
    underscored: true,
    modelName: 'plan',
    defaultScope: {
      include: [
        {
          model: PlanRenovation,
          include: [HourlySpaceReservation],
        },
      ],
    },
    scopes: {
      mainContext(destinationTz: string) {
        return {
          include: [PlanType, PlanRenovation.scope(['withReservations', { method: ['currentOne', destinationTz] }])],
        };
      },
      byUser(userId: number) {
        return {
          include: [
            {
              model: User,
              attributes: [],
              where: { id: userId },
            },
          ],
        };
      },
      byCompany(companyId: number) {
        return {
          where: { companyId },
          include: [{ model: Company }, { model: Country, include: [{ model: Currency }] }],
        };
      },
    },
    hooks: {
      // @ts-ignore
      afterFind(plans) {
        if (isArray(plans)) {
          plans = plans.map(applyIsDeletable);
        } else {
          applyIsDeletable(plans);
        }
        return plans;
      },
    },
  }
);

export default Plan;
