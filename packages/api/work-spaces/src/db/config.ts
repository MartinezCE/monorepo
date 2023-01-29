import dotenv from 'dotenv';

dotenv.config();

export const development = {
  database: process.env.DB_NAME as string,
  username: process.env.DB_USER as string,
  host: process.env.DB_HOST,
  dialect: 'mysql',
  password: process.env.DB_PASSWORD,
  logging: process.env.DB_LOGGING === 'true',
  sync: {
    alter: false,
    force: false,
  },
};

export const production = {
  database: process.env.DB_NAME as string,
  username: process.env.DB_USER as string,
  host: process.env.DB_HOST,
  dialect: 'mysql',
  password: process.env.DB_PASSWORD,
  logging: false,
  sync: {
    alter: false,
    force: false,
  },
};

export const staging = {
  database: process.env.DB_NAME as string,
  username: process.env.DB_USER as string,
  host: process.env.DB_HOST,
  dialect: 'mysql',
  password: process.env.DB_PASSWORD,
  logging: false,
  sync: {
    alter: false,
    force: false,
  },
};

export const testing = development;
