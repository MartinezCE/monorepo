import config from '../config';
import { StrapiImage } from '../interfaces/api';

export const getImageProps = (
  image?: { data?: Partial<StrapiImage> },
  layout?: 'intrinsic' | 'fill' | 'fixed' | 'responsive'
) => ({
  src: image?.data?.attributes?.url ? `${config.STRAPI_ASSETS_BASE_URL}${image?.data?.attributes?.url}` : '/',
  alt: image?.data?.attributes?.alternativeText,
  height: layout !== 'fill' ? image?.data?.attributes?.height || 0 : undefined,
  width: layout !== 'fill' ? image?.data?.attributes?.width || 0 : undefined,
  layout: layout || 'intrinsic',
});
