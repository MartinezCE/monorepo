/* eslint-disable import/no-cycle */
import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';
import Company from './Company';
import Location from './Location';
import User from './User';

export interface FloorAttributes {
  id?: number;
  locationId: number;
  location?: Location;
  number: string;
}

export interface FloorInput extends Optional<FloorAttributes, 'id'> {}
export interface FloorOuput extends Required<FloorAttributes> {}

class Floor extends Model<FloorAttributes, FloorInput> implements FloorAttributes {
  declare id: number;

  declare locationId: number;

  declare location?: Location;

  declare number: string;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

Floor.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    locationId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Location,
        key: 'id',
      },
    },
    number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    paranoid: true,
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'floor',
    scopes: {
      byUser(userId) {
        return {
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
        };
      },
      byLocation(locationId) {
        return {
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
        };
      },
    },
  }
);

export default Floor;
