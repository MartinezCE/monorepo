import axios from 'axios';
import config from '../config';
import { DefaultStrapiResponse } from '../interfaces/api';

export const strapi = axios.create({
  baseURL: `${config.STRAPI_URL}/api` || '',
  headers: {
    Authorization: `Bearer ${config.STRAPI_ACCESS_TOKEN}`,
  },
  params: {},
  transformResponse: string => (JSON.parse(string) as DefaultStrapiResponse<unknown>)?.data || {},
});
