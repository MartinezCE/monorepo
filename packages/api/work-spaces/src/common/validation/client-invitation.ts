import { Schema } from 'express-validator';

export const clientsInviteValidationSchema: Schema = {
  companyId: {
    isInt: true,
  },
  emails: {
    isArray: true,
  },
  'emails.*.email': {
    trim: true,
    isEmail: true,
  },
  'emails.*.firstName': {
    isString: true,
    optional: true,
  },
  'emails.*.lastName': {
    isString: true,
    optional: true,
  },
};
