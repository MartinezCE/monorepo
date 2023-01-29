import { Schema } from 'express-validator';
import { BlueprintStatus } from '../../db/models/Blueprint';
import { locationValidationSchema } from './location';

export const clientLocationValidationSchema: Schema = {
  ...locationValidationSchema,
  floors: {
    isArray: true,
    optional: true,
  },
  'floors.*.id': {
    isInt: true,
    optional: true,
  },
  'floors.*.number': {
    isInt: true,
  },
  'floors.*.blueprints': {
    isArray: true,
  },
  'floors.*.blueprints.*.id': {
    isInt: true,
    optional: true,
  },
  'floors.*.blueprints.*.status': {
    isIn: {
      options: [Object.keys(BlueprintStatus)],
    },
  },
  'floors.*.blueprints.*.name': {
    isString: true,
  },
  'floors.*.blueprints.*.url': {
    isURL: true,
  },
};
