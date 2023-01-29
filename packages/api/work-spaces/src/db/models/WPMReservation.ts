/* eslint-disable import/no-cycle */
import { startOfDate } from '@wimet/api-shared';
import { endOfDay, startOfDay } from 'date-fns';
import { calendar_v3 } from 'googleapis';
import { DataTypes, Model, Op, Optional } from 'sequelize';
import DateHelper from '../../helpers/date';
import database from '../database';
import Blueprint from './Blueprint';
import Company from './Company';
import Floor from './Floor';
import Location from './Location';
import Seat from './Seat';
import User from './User';
import WPMReservationType from './WPMReservationType';

export enum WPMReservationStatus {
  PENDING = 'PENDING',
  CANCEL = 'CANCEL',
  DONE = 'DONE',
}

export type WPMReservationProviderNames = 'google';

export type WPMReservationProvider = {
  eventId: string;
  name: WPMReservationProviderNames;
  synced: boolean;
};

interface WPMReservationAttributes {
  id?: number;
  provider?: WPMReservationProvider;
  providerPayload?: calendar_v3.Schema$Event;
  WPMReservationType?: WPMReservationType;
  WPMReservationTypeId: number;
  userId: number;
  seatId: number;
  originTz: string;
  originOffset: number;
  destinationTz: string;
  destinationOffset: number;
  startAt: string;
  endAt: string;
  status: WPMReservationStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WPMReservationInput extends Optional<WPMReservationAttributes, 'id'> {}
export interface WPMReservationOuput extends Required<WPMReservationAttributes> {}

class WPMReservation extends Model<WPMReservationAttributes, WPMReservationInput> implements WPMReservationAttributes {
  declare id: number;

  declare provider?: WPMReservationProvider;

  declare providerPayload?: calendar_v3.Schema$Event;

  declare WPMReservationType?: WPMReservationType;

  declare WPMReservationTypeId: number;

  declare userId: number;

  declare seatId: number;

  declare originTz: string;

  declare originOffset: number;

  declare destinationTz: string;

  declare destinationOffset: number;

  declare startAt: string;

  declare endAt: string;

  declare status: WPMReservationStatus;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

WPMReservation.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    provider: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    providerPayload: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    WPMReservationTypeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'wpm_reservation_type_id',
      references: {
        model: WPMReservationType,
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
    seatId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Seat,
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
    startAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'CANCEL', 'DONE'),
      defaultValue: 'DONE',
    },
  },
  {
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'WPMReservation',
    tableName: 'wpm_reservations',
    scopes: {
      byUser(userId: number) {
        return {
          where: { userId },
        };
      },
      byCompany(companyId) {
        return {
          include: [
            {
              model: User,
              required: true,
              attributes: ['email', 'firstName', 'lastName', 'avatarUrl'],
              include: [
                {
                  model: Company,
                  required: true,
                  attributes: [],
                  where: {
                    id: companyId,
                  },
                },
              ],
            },
            {
              model: Seat,
              required: true,
              attributes: ['name'],
              include: [
                {
                  model: Blueprint,
                  required: true,
                  attributes: ['name'],
                  include: [
                    {
                      model: Floor,
                      required: true,
                      attributes: ['number'],
                    },
                  ],
                },
              ],
            },
          ],
        };
      },
      byLocation(locationId) {
        return {
          include: [
            {
              model: User,
              required: true,
              attributes: ['firstName', 'lastName'],
            },
            {
              model: Seat,
              required: true,
              attributes: ['name'],
              include: [
                {
                  model: Blueprint,
                  required: true,
                  attributes: ['name'],
                  include: [
                    {
                      model: Floor,
                      required: true,
                      attributes: ['number'],
                      include: [
                        {
                          model: Location,
                          required: true,
                          attributes: ['name'],
                          where: {
                            id: locationId,
                          },
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
      withLocation(locationId?) {
        return {
          include: [
            {
              model: Seat,
              required: true,
              include: [
                {
                  model: Blueprint,
                  required: true,
                  include: [
                    {
                      model: Floor,
                      required: true,
                      include: [
                        {
                          model: Location,
                          where: locationId
                            ? {
                                id: locationId,
                              }
                            : {},
                          required: true,
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
      withReservationType() {
        return {
          include: [
            {
              model: WPMReservationType,
              required: true,
              attributes: ['name'],
            },
          ],
        };
      },
      byBlueprint(blueprintId: number) {
        return {
          include: {
            model: Seat,
            required: true,
            attributes: [],
            include: [
              {
                model: Blueprint,
                required: true,
                attributes: [],
                where: { id: blueprintId },
              },
            ],
          },
        };
      },
      betweenDates(startAt: string, endAt: string) {
        return {
          where: {
            startAt: { [Op.gte]: startAt },
            endAt: { [Op.lte]: endAt },
          },
        };
      },
      byDate(selectedDate = startOfDate(), originTz: string, destinationTz: string) {
        const startAtLimit = DateHelper.toDestinationTz(selectedDate, originTz, destinationTz, startOfDay);
        const endAtLimit = DateHelper.toDestinationTz(selectedDate, originTz, destinationTz, endOfDay);

        return {
          where: {
            startAt: { [Op.gte]: startAtLimit },
            endAt: { [Op.lte]: endAtLimit },
          },
        };
      },
      withUser() {
        return {
          include: [
            {
              model: User,
              required: true,
              attributes: { exclude: ['password'] },
            },
          ],
        };
      },
    },
  }
);

export default WPMReservation;
