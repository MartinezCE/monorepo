/* eslint-disable import/no-cycle */
import {
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  Model,
  Optional,
} from 'sequelize';
import database from '../database';
import Amenity from './Amenity';
import Company from './Company';
import Location, { LocationOutput } from './Location';
import SpaceAmenity from './SpaceAmenity';
import SpaceFile from './SpaceFile';
import SpaceType from './SpaceType';
import SpaceReservationType from './SpaceReservationType';
import User from './User';
import SpaceOffer from './SpaceOffer';

export enum SpaceStatus {
  IN_PROCESS = 'IN_PROCESS',
  PUBLISHED = 'PUBLISHED',
}
interface SpaceAttributes {
  id?: number;
  locationId?: number;
  name: string;
  spaceReservationTypeId?: number;
  spaceOfferId?: number;
  spaceTypeId?: number;
  peopleCapacity?: number;
  area?: string;
  tourUrl?: string;
  order?: number;
  status: SpaceStatus;
  location?: LocationOutput;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SpaceInput
  extends Optional<SpaceAttributes, 'id' | 'locationId' | 'spaceReservationTypeId' | 'spaceTypeId' | 'status'> {}
export interface SpaceOuput extends Required<SpaceAttributes> {}

class Space extends Model<SpaceAttributes, SpaceInput> implements SpaceAttributes {
  declare id: number;

  declare locationId: number;

  declare location: LocationOutput;

  declare spaceReservationTypeId: number;

  declare name: string;

  declare area: string;

  declare peopleCapacity: number;

  declare spaceTypeId: number;

  declare spaceOfferId: number;

  declare currencyId: number;

  declare tourUrl: string;

  declare status: SpaceStatus;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  declare getSpaceFiles: HasManyGetAssociationsMixin<SpaceFile>;

  declare addSpaceFiles: HasManyAddAssociationMixin<SpaceFile, number>;

  declare hasSpaceFiles: HasManyHasAssociationMixin<SpaceFile, number>;

  declare setSpaceFiles: HasManySetAssociationsMixin<SpaceFile, number>;

  declare removeSpaceFile: HasManyRemoveAssociationsMixin<SpaceAmenity, number>;

  declare countSpaceFiles: HasManyCountAssociationsMixin;

  declare createSpaceFiles: HasManyCreateAssociationMixin<SpaceFile>;

  declare getSpaceAmenities: HasManyGetAssociationsMixin<SpaceAmenity>;

  declare addSpaceAmenity: HasManyAddAssociationMixin<SpaceAmenity, number>;

  declare hasSpaceAmenity: HasManyHasAssociationMixin<SpaceAmenity, number>;

  declare setSpaceAmenities: HasManySetAssociationsMixin<SpaceAmenity, number>;

  declare removeSpaceAmenities: HasManyRemoveAssociationsMixin<SpaceAmenity, number>;

  declare countSpaceAmenities: HasManyCountAssociationsMixin;

  declare createSpaceAmenity: HasManyCreateAssociationMixin<SpaceAmenity>;

  declare readonly spaceFiles?: SpaceFile[];

  declare readonly spacesAmenities?: SpaceAmenity[];
}

Space.init(
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
    peopleCapacity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    area: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    spaceOfferId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: SpaceOffer,
        key: 'id',
      },
    },
    tourUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    locationId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Location,
        key: 'id',
      },
    },
    spaceReservationTypeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: SpaceReservationType,
        key: 'id',
      },
    },
    spaceTypeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: SpaceType,
        key: 'id',
      },
    },
    order: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.keys(SpaceStatus)),
      allowNull: true,
      defaultValue: SpaceStatus.IN_PROCESS,
    },
  },
  {
    paranoid: true,
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'space',
    scopes: {
      byUser(userId, spaceId) {
        return {
          where: {
            id: spaceId,
          },
          include: [
            SpaceReservationType,
            {
              model: Location,
              required: true,
              include: [
                {
                  model: Company,
                  required: true,
                  include: [
                    {
                      model: User,
                      attributes: [],
                      where: {
                        id: userId,
                      },
                    },
                  ],
                },
              ],
            },
            {
              model: SpaceAmenity,
              include: [
                {
                  model: Amenity,
                },
              ],
            },
            SpaceFile,
            SpaceType,
          ],
        };
      },
    },
  }
);

export default Space;
