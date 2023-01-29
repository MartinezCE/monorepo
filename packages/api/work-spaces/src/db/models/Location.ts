/* eslint-disable import/no-cycle */
import { isArray } from 'lodash';
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
import { getNullpercentage } from '@wimet/api-shared';
import database from '../database';
import Amenity from './Amenity';
import Company, { CompanyOuput } from './Company';
import LocationAmenity from './LocationAmenity';
import LocationFile from './LocationFile';
import User from './User';
import FileService from '../../services/file';
import Currency, { CurrencyOuput } from './Currency';
import Space from './Space';
import Floor from './Floor';
import Blueprint from './Blueprint';
import Seat from './Seat';
import State from './State';

export enum LocationStatus {
  PENDING = 'PENDING',
  IN_PROCESS = 'IN_PROCESS',
  PUBLISHED = 'PUBLISHED',
}

export type LocationProviderNames = 'google';

type LocationProvider = {
  name: LocationProviderNames;
  id: string;
};

export interface LocationAttributes {
  id?: number;
  provider?: LocationProvider;
  companyId?: number;
  description?: string;
  address: string;
  streetName?: string;
  streetNumber?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  accessCode?: string;
  comments?: string;
  tourUrl?: string;
  latitude: number;
  longitude: number;
  currencyId: number;
  currency?: CurrencyOuput;
  company?: CompanyOuput;
  stateId?: number;
  status?: LocationStatus;
  name: string;
}

export interface LocationInput
  extends Optional<LocationAttributes, 'id' | 'companyId' | 'comments' | 'tourUrl' | 'accessCode'> {}

export interface LocationOutput extends Required<LocationAttributes> {}

class Location extends Model<LocationAttributes, LocationInput> implements LocationAttributes {
  declare id: number;

  declare provider?: LocationProvider;

  declare companyId: number;

  declare description?: string;

  declare address: string;

  declare tourUrl?: string;

  declare comments?: string;

  declare accessCode?: string;

  declare latitude: number;

  declare longitude: number;

  declare streetName?: string;

  declare streetNumber?: string;

  declare city?: string;

  declare state?: string;

  declare country?: string;

  declare postalCode?: string;

  declare company: CompanyOuput;

  declare stateId?: number;

  declare currencyId: number;

  declare currency: CurrencyOuput;

  declare status?: LocationStatus;

  declare name: string;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  declare getLocationFiles: HasManyGetAssociationsMixin<LocationFile>;

  declare addLocationFiles: HasManyAddAssociationMixin<LocationFile, number>;

  declare hasLocationFiles: HasManyHasAssociationMixin<LocationFile, number>;

  declare setLocationFiles: HasManySetAssociationsMixin<LocationFile, number>;

  declare removeLocationFile: HasManyRemoveAssociationsMixin<LocationAmenity, number>;

  declare countLocationFiles: HasManyCountAssociationsMixin;

  declare createLocationFiles: HasManyCreateAssociationMixin<LocationFile>;

  declare getLocationsAmenities: HasManyGetAssociationsMixin<LocationAmenity>;

  declare addLocationAmenity: HasManyAddAssociationMixin<LocationAmenity, number>;

  declare hasLocationAmenity: HasManyHasAssociationMixin<LocationAmenity, number>;

  declare setLocationsAmenities: HasManySetAssociationsMixin<LocationAmenity, number>;

  declare removeLocationsAmenities: HasManyRemoveAssociationsMixin<LocationAmenity, number>;

  declare countLocationsAmenities: HasManyCountAssociationsMixin;

  declare createLocationAmenity: HasManyCreateAssociationMixin<LocationAmenity>;

  declare getSpaces: HasManyGetAssociationsMixin<Space>;

  declare readonly locationFiles?: LocationFile[];

  declare readonly locationsAmenities?: LocationAmenity[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const applyPercentage = (model: any) => {
  if (model) {
    model.dataValues = {
      ...model.dataValues,
      ...getNullpercentage(model.toJSON()),
    };
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const applyGroupFiles = (model: any) => {
  if (model?.dataValues?.locationFiles?.length > 0) {
    (model.dataValues || {}).locationFiles = FileService.groupFileByType(model?.dataValues?.locationFiles || []);
  }
};

Location.init(
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
    companyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Company,
        key: 'id',
      },
    },
    latitude: {
      type: DataTypes.DECIMAL(8, 6),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tourUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comments: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accessCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'IN_PROCESS', 'PUBLISHED'),
      allowNull: true,
      defaultValue: 'IN_PROCESS',
    },
    streetName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    streetNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stateId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: State,
        key: 'id',
      },
    },
    currencyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: Currency,
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'location',
    hooks: {
      // @ts-ignore
      afterFind(result) {
        if (isArray(result)) {
          result = result.map(model => {
            applyPercentage(model);
            applyGroupFiles(model);
            return model;
          });
        } else {
          // @ts-ignore
          applyPercentage(result);
          applyGroupFiles(result);
        }

        return result;
      },
    },
    scopes: {
      byUser(userId, locationId) {
        const where = {
          ...(locationId ? { id: locationId } : {}),
        };

        return {
          where,
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
            {
              model: LocationAmenity,
              include: [
                {
                  model: Amenity,
                },
              ],
            },
            {
              model: LocationFile,
            },
          ],
        };
      },
      bySeat(seatId: number) {
        return {
          include: [
            {
              model: Floor,
              required: true,
              attributes: [],
              include: [
                {
                  model: Blueprint,
                  required: true,
                  attributes: [],
                  include: [
                    {
                      model: Seat,
                      required: true,
                      attributes: [],
                      where: { id: seatId },
                    },
                  ],
                },
              ],
            },
          ],
        };
      },
    },
  }
);

export default Location;
