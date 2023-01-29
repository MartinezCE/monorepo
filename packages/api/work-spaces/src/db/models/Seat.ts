/* eslint-disable import/no-cycle */
import { Point } from 'geojson';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import database from '../database';
import Amenity from './Amenity';
import Blueprint from './Blueprint';
import Company from './Company';
import Floor from './Floor';
import Location from './Location';
import SpaceType from './SpaceType';
import User from './User';
import WPMReservation from './WPMReservation';
import WPMReservationType, { WPMReservationTypes } from './WPMReservationType';

export type SeatProviderNames = 'google';

export type SeatProvider = {
  id: string;
  name: SeatProviderNames;
  calendarId: string;
  calendarSyncToken: string;
  webhook: {
    id: string;
    resourceId: string;
    expiration: string;
  };
};

export interface SeatAttributes {
  id?: number;
  provider?: SeatProvider;
  blueprintId: number;
  geometry?: Point;
  isAvailable?: boolean;
  name?: string;
  WPMReservations?: WPMReservation[];
  spaceTypeId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SeatInput extends Optional<SeatAttributes, 'id'> {}
export interface SeatOuput extends Required<SeatAttributes> {}

class Seat extends Model<SeatAttributes, SeatInput> implements SeatAttributes {
  declare id: number;

  declare provider?: SeatProvider;

  declare blueprintId: number;

  declare blueprint: Blueprint;

  declare geometry?: Point;

  declare name?: string;

  declare isAvailable?: boolean;

  declare WPMReservations?: WPMReservation[];

  declare spaceTypeId: number;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

Seat.init(
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
    blueprintId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Blueprint,
        key: 'id',
      },
    },
    geometry: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    spaceTypeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: SpaceType,
        key: 'id',
      },
    },
  },
  {
    paranoid: true,
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'seat',
    scopes: {
      byUser(userId) {
        return {
          include: [
            {
              model: Blueprint,
              attributes: [],
              required: true,
              include: [
                {
                  model: Floor,
                  attributes: [],
                  required: true,
                  include: [
                    {
                      model: Location,
                      attributes: [],
                      required: true,
                      include: [
                        {
                          model: Company,
                          attributes: [],
                          required: true,
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
      byBlueprint(blueprintId) {
        return {
          where: {
            blueprintId,
          },
        };
      },
      byLocation(locationId) {
        return {
          include: [
            {
              model: Blueprint,
              required: true,
              attributes: [],
              include: [
                {
                  model: Floor,
                  required: true,
                  attributes: [],
                  where: {
                    locationId,
                  },
                },
              ],
            },
          ],
        };
      },
      withReservations(
        includeReservationsUser: boolean,
        selectedDate?: Date,
        originTz?: string,
        destinationTz?: string
      ) {
        return {
          include: [
            {
              model: selectedDate
                ? WPMReservation.scope({ method: ['byDate', selectedDate, originTz, destinationTz] })
                : WPMReservation,
              required: false,
              include: [
                WPMReservationType,
                ...(includeReservationsUser
                  ? [{ model: User, attributes: ['id', 'firstName', 'lastName', 'avatarUrl', 'avatarKey'] }]
                  : []),
              ],
            },
          ],
          order: [
            database.fn(
              'FIELD',
              database.col('WPMReservations.WPMReservationType.name'),
              ...Object.keys(WPMReservationTypes)
            ),
          ],
        };
      },
      withAmenities() {
        return {
          include: [
            {
              model: Amenity,
              through: { attributes: [] },
            },
          ],
        };
      },
      filterByUserAmenity(userId: number) {
        return {
          include: [
            {
              model: Amenity,
              through: { attributes: [] },
              include: [{ model: User }],
            },
          ],
          where: Sequelize.where(Sequelize.col('amenities.users.id'), '=', `${userId}`),
        };
      },
      byCompany(companyId) {
        return {
          include: [
            {
              model: Blueprint,
              required: true,
              attributes: [],
              include: [
                {
                  model: Floor,
                  required: true,
                  attributes: [],
                  include: [
                    {
                      model: Location,
                      required: true,
                      attributes: [],
                      include: [
                        {
                          model: Company,
                          required: true,
                          attributes: [],
                          where: { id: companyId },
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
      byAmenity(amenityId) {
        return {
          include: [
            {
              model: Amenity,
              through: { attributes: [] },
              where: { id: amenityId },
            },
          ],
        };
      },
      withSpaceType() {
        return {
          include: [
            {
              model: SpaceType,
            },
          ],
        };
      },
      byWebhook(providerName: SeatProviderNames, websocketId: string) {
        return {
          where: { provider: { name: providerName, webhook: { id: websocketId } } as SeatProvider },
        };
      },
      withCompany() {
        return {
          include: [
            {
              model: Blueprint,
              include: [{ model: Floor, include: [{ model: Location, include: [{ model: Company }] }] }],
            },
          ],
        };
      },
    },
  }
);

export default Seat;
