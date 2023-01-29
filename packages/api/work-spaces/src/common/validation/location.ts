import { Schema } from 'express-validator';

export const locationValidationSchema: Schema = {
  description: {
    isString: true,
    optional: true,
  },
  address: {
    isString: true,
    optional: true,
  },
  latitude: {
    isDecimal: true,
    optional: true,
  },
  longitude: {
    isDecimal: true,
    optional: true,
  },
  accessCode: {
    isString: true,
    optional: {
      options: { nullable: true },
    },
  },
  city: {
    isString: true,
    optional: {
      options: { nullable: true },
    },
  },
  country: {
    isString: true,
    optional: {
      options: { nullable: true },
    },
  },
  state: {
    isString: true,
    optional: {
      options: { nullable: true },
    },
  },
  postalCode: {
    isString: true,
    optional: {
      options: { nullable: true },
    },
  },
  streetName: {
    isString: true,
    optional: {
      options: { nullable: true },
    },
  },
  streetNumber: {
    isString: true,
    optional: {
      options: { nullable: true },
    },
  },
  comments: {
    isString: true,
    optional: {
      options: { nullable: true },
    },
  },
  tourUrl: {
    isString: true,
    optional: {
      options: { nullable: true },
    },
  },
  locationFiles: {
    isArray: true,
    optional: true,
  },
  'locationFiles.*.url': {
    isString: true,
  },
  'locationFiles.*.type': {
    isString: true,
  },
  'locationFiles.*.mimetype': {
    isString: true,
  },
  'locationFiles.*.name': {
    isString: true,
  },
  'locationFiles.*.key': {
    isString: true,
  },
};
