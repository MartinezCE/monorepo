/* eslint-disable import/no-cycle */
import { BelongsToManyRemoveAssociationsMixin, DataTypes, Model, Optional } from 'sequelize';
import database from '../database';
import Blueprint from './Blueprint';
import Company from './Company';
import Floor from './Floor';
import Location from './Location';
import Seat from './Seat';
import User from './User';

export type AmenityTypes = 'LOCATION' | 'SPACE' | 'SAFETY' | 'SEAT' | 'CUSTOM';

export interface AmenityAttributes {
  id?: number;
  name: string;
  isDefault: boolean;
  type: AmenityTypes;
  fileName: string;
  seats?: Seat[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AmenityInput extends Optional<AmenityAttributes, 'id'> {}
export interface AmenityOuput extends Required<AmenityAttributes> {}

class Amenity extends Model<AmenityAttributes, AmenityInput> implements AmenityAttributes {
  declare id: number;

  declare name: string;

  declare fileName: string;

  declare type: AmenityTypes;

  declare isDefault: boolean;

  declare seats: Seat[];

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  declare removeUsers: BelongsToManyRemoveAssociationsMixin<User, number>;

  declare removeSeats: BelongsToManyRemoveAssociationsMixin<Seat, number>;
}

Amenity.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('LOCATION', 'SPACE', 'SAFETY', 'SEAT', 'CUSTOM'),
      allowNull: false,
      defaultValue: 'CUSTOM',
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING,
      defaultValue: 'Star.svg',
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'amenity',
    name: {
      plural: 'amenities',
    },
    scopes: {
      byCompany(companyId: number) {
        return {
          include: {
            model: Company,
            required: true,
            attributes: [],
            where: { id: companyId },
            through: { attributes: [] },
          },
        };
      },
      bySeatCompany(companyId) {
        return {
          include: {
            model: Seat,
            required: true,
            through: { attributes: [] },
            include: [
              {
                model: Blueprint,
                required: true,
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
          },
        };
      },
      byBlueprint(blueprintId) {
        return {
          include: {
            model: Seat,
            required: true,
            through: { attributes: [] },
            include: [
              {
                model: Blueprint,
                required: true,
                where: { id: blueprintId },
              },
            ],
          },
        };
      },
    },
  }
);

export default Amenity;
