/* eslint-disable import/no-cycle */
import { subMonths } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { DataTypes, Model, Op, Optional } from 'sequelize';
import database from '../database';
import Credits from './Credits';
import FeePercentage from './FeePercentage';
import HourlySpaceHistory from './HourlySpaceHistory';
import HourlySpaceReservation from './HourlySpaceReservation';
import Plan from './Plan';
import PlanCredit from './PlanCredit';

interface PlanRenovationAttributes {
  id?: number;
  planId: number;
  startDate: string;
  endDate: string;
  planCreditId?: number;
  usedCredits?: number;
  unusedCredits?: number;
  totalCredits?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PlanRenovationInput extends Optional<PlanRenovationAttributes, 'id'> {}
export interface PlanRenovationOuput extends Required<PlanRenovationAttributes> {}

class PlanRenovation extends Model<PlanRenovationAttributes, PlanRenovationInput> implements PlanRenovationAttributes {
  declare id: number;

  declare plan?: Plan;

  declare planId: number;

  declare startDate: string;

  declare endDate: string;

  declare planCreditId?: number;

  declare planCredit?: PlanCredit;

  declare usedCredits?: number;

  declare unusedCredits?: number;

  declare totalCredits?: number;

  declare hourlySpaceReservations?: HourlySpaceReservation[];

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

PlanRenovation.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    planId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Plan,
        key: 'id',
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    planCreditId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: PlanCredit,
        key: 'id',
      },
    },
    usedCredits: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    unusedCredits: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    totalCredits: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
  },
  {
    paranoid: true,
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'planRenovation',
    scopes: {
      previousOne(destinationTz: string, amount = 1) {
        const destinationDate = zonedTimeToUtc(subMonths(new Date(), amount), destinationTz);
        return {
          order: [['created_at', 'DESC']],
          where: { startDate: { [Op.lte]: destinationDate }, endDate: { [Op.gte]: destinationDate } },
        };
      },
      currentOne(destinationTz: string) {
        const destinationDate = zonedTimeToUtc(new Date(), destinationTz);
        return {
          order: [['created_at', 'DESC']],
          where: { startDate: { [Op.lte]: destinationDate }, endDate: { [Op.gte]: destinationDate } },
        };
      },
      withReservations() {
        return {
          order: [['created_at', 'DESC']],
          include: [{ model: HourlySpaceReservation, include: [HourlySpaceHistory, FeePercentage, Credits] }],
        };
      },
    },
  }
);

export default PlanRenovation;
