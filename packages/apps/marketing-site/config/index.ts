export default {
  NODE_ENV: process.env.NODE_ENV || 'development',
  STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
  STRAPI_ASSETS_BASE_URL: process.env.NEXT_PUBLIC_STRAPI_ASSETS_BASE_URL || '',
  STRAPI_ACCESS_TOKEN: process.env.STRAPI_ACCESS_TOKEN || '',
};
