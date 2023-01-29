/* eslint-disable import/no-cycle */
import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';
import Company from './Company';
import Credits, { CreditOuput } from './Credits';
import FeePercentage, { FeePercentageOuput } from './FeePercentage';
import HourlySpaceHistory, { HourlySpaceHistoryOuput } from './HourlySpaceHistory';
import Location from './Location';
import Plan from './Plan';
import Space from './Space';
import SpaceFile from './SpaceFile';
import PlanRenovation, { PlanRenovationOuput } from './PlanRenovation';
import User, { UserOuput } from './User';
import { ModelTimestamps } from '../../interfaces';
import SpaceType from './SpaceType';

export enum HourlySpaceReservationHourlyTypes {
  PER_HOUR = 'PER_HOUR',
  HALF_DAY = 'HALF_DAY',
  DAYPASS = 'DAYPASS',
}

export enum HourlySpaceReservationHalfDayTypes {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
}

interface HourlySpaceReservationAttributes extends ModelTimestamps {
  id?: number;
  userId: number;
  user?: UserOuput;
  spaceId: number;
  planRenovationId: number;
  planRenovation?: PlanRenovationOuput;
  type: HourlySpaceReservationHourlyTypes;
  hourlySpaceHistoryId: number;
  hourlySpaceHistory?: HourlySpaceHistoryOuput;
  feePercentageId: number;
  feePercentage?: FeePercentageOuput;
  creditId: number;
  credit?: CreditOuput;
  originTz: string;
  originOffset: number;
  destinationTz: string;
  destinationOffset: number;
  startDate?: string;
  endDate?: string;
  halfDayType: HourlySpaceReservationHalfDayTypes;
  space?: Space;
}

export interface HourlySpaceReservationInput
  extends Optional<HourlySpaceReservationAttributes, 'id' | 'startDate' | 'endDate'> {}
export interface HourlySpaceReservationOuput extends Required<HourlySpaceReservationAttributes> {}

class HourlySpaceReservation
  extends Model<HourlySpaceReservationAttributes, HourlySpaceReservationInput>
  implements HourlySpaceReservationAttributes
{
  declare id: number;

  declare userId: number;

  declare user?: UserOuput;

  declare spaceId: number;

  declare planRenovationId: number;

  declare planRenovation?: PlanRenovationOuput;

  declare type: HourlySpaceReservationHourlyTypes;

  declare halfDayType: HourlySpaceReservationHalfDayTypes;

  declare hourlySpaceHistoryId: number;

  declare hourlySpaceHistory: HourlySpaceHistoryOuput;

  declare feePercentageId: number;

  declare feePercentage?: FeePercentageOuput;

  declare creditId: number;

  declare credit?: CreditOuput;

  declare originTz: string;

  declare originOffset: number;

  declare destinationTz: string;

  declare destinationOffset: number;

  declare startDate?: string;

  declare endDate?: string;

  declare space?: Space;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  declare readonly deletedAt: Date;
}

HourlySpaceReservation.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    spaceId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Space,
        key: 'id',
      },
    },
    planRenovationId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: PlanRenovation,
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM(...Object.values(HourlySpaceReservationHourlyTypes)),
    },
    halfDayType: {
      type: DataTypes.ENUM('MORNING', 'AFTERNOON'),
      allowNull: true,
    },
    hourlySpaceHistoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: HourlySpaceHistory,
        key: 'id',
      },
    },
    feePercentageId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: FeePercentage,
        key: 'id',
      },
    },
    creditId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Credits,
        key: 'id',
      },
    },
    originTz: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'UTC',
    },
    originOffset: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    destinationTz: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'UTC',
    },
    destinationOffset: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    sequelize: database,
    paranoid: false,
    underscored: true,
    modelName: 'hourlySpaceReservation',
    tableName: 'hourly_space_reservations',
    scopes: {
      byCompany(companyId) {
        return {
          include: [
            {
              model: PlanRenovation,
              required: true,
              include: [
                {
                  model: Plan,
                  required: true,
                  include: [
                    {
                      model: Company,
                      attributes: [],
                      required: true,
                      where: {
                        id: companyId,
                      },
                    },
                  ],
                },
              ],
            },
            {
              model: Space,
              required: true,
              include: [SpaceFile, Location],
            },
            User,
          ],
        };
      },
      byPartner(companyId) {
        return {
          include: [
            {
              model: Space,
              required: true,
              include: [
                {
                  model: Location,
                  required: true,
                  include: [
                    {
                      model: Company,
                      required: true,
                      where: {
                        id: companyId,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };
      },
      byUser(userId: number) {
        return {
          where: { userId },
        };
      },
      byPlan(planId: number) {
        return {
          include: [
            {
              model: PlanRenovation,
              attributes: [],
              required: true,
              where: { planId },
            },
          ],
        };
      },
      mainContext() {
        return {
          include: [
            { model: User, attributes: { exclude: ['password'] }, paranoid: false },
            { model: Space, include: [Location, SpaceType] },
            HourlySpaceHistory,
            Credits,
            FeePercentage,
          ],
        };
      },
      paginate(limit, offset) {
        return {
          limit,
          offset,
        };
      },
    },
  }
);

export default HourlySpaceReservation;
