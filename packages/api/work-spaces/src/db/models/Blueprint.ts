/* eslint-disable import/no-cycle */
import { startOfDate } from '@wimet/api-shared';
import {
  BelongsToManyHasAssociationsMixin,
  DataTypes,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManySetAssociationsMixin,
  Model,
  Optional,
} from 'sequelize';
import aws from 'aws-sdk';
import database from '../database';
import Company from './Company';
import Floor from './Floor';
import Location from './Location';
import Seat from './Seat';
import User from './User';
import logger from '../../helpers/logger';

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});

const loggerInstance = logger('blueprint-models');

const sqs = new aws.SQS({ apiVersion: '2012-11-05' });

export enum BlueprintStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
}

export interface BlueprintAttributes {
  id?: number;
  floorId: number;
  floor?: Floor;
  status?: BlueprintStatus;
  name: string;
  key?: string;
  mimetype?: string;
  url?: string;
  seats?: Seat[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BlueprintInput extends Optional<BlueprintAttributes, 'id'> {}
export interface BlueprintOuput extends Required<BlueprintAttributes> {}

class Blueprint extends Model<BlueprintAttributes, BlueprintInput> implements BlueprintAttributes {
  declare id: number;

  declare floorId: number;

  declare floor?: Floor;

  declare status?: BlueprintStatus;

  declare name: string;

  declare key?: string;

  declare mimetype?: string;

  declare url?: string;

  declare seats?: Seat[];

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  declare hasSeats: HasManyHasAssociationsMixin<Seat, number>;

  declare hasAmenities: BelongsToManyHasAssociationsMixin<Blueprint, number>;

  declare setUsers: HasManySetAssociationsMixin<User, number>;

  declare removeUser: HasManyRemoveAssociationMixin<User, number>;
}

Blueprint.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    floorId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Floor,
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'PENDING', 'PUBLISHED'),
      allowNull: true,
      defaultValue: 'DRAFT',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mimetype: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    paranoid: true,
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'blueprint',
    scopes: {
      byUser(userId) {
        return {
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
        };
      },
      byLocation(locationId) {
        return {
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
                  where: {
                    id: locationId,
                  },
                },
              ],
            },
          ],
        };
      },
      byCompany(companyId) {
        return {
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
      withReservations(includeReservationsUser, selectedDate = startOfDate()) {
        return {
          include: [
            {
              model: Seat.scope({ method: ['withReservations', includeReservationsUser, selectedDate] }),
              required: false,
            },
          ],
        };
      },
      bySeat(seatId: number) {
        return {
          include: [
            {
              model: Seat,
              required: true,
              where: {
                id: seatId,
              },
            },
          ],
        };
      },
    },
    hooks: {
      async afterBulkCreate(blueprints) {
        blueprints.forEach(blueprint => {
          const params = {
            MessageBody: JSON.stringify({
              blueprintId: blueprint.getDataValue('id'),
              floorId: blueprint.getDataValue('floorId'),
            }),
            QueueUrl: 'https://sqs.us-west-2.amazonaws.com/431284279428/associatePlanToUsers',
          };
          sqs.sendMessage(params, (err, data) => {
            if (err) {
              loggerInstance.error('Error', err);
            } else {
              loggerInstance.error('Success', data.MessageId);
            }
          });
        });
      },
    },
  }
);

export default Blueprint;
