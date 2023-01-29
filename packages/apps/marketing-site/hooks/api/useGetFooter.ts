import { useQuery } from 'react-query';
import { strapi } from '../../strapi';

import { Locale, StrapiData } from '../../interfaces/api';
import { Link, LinkGroup, SocialLink } from './types';

export const GET_FOOTER = 'GET_FOOTER';

export type FooterApiResponse = StrapiData<{
  createdAt: string;
  locale: string;
  publishedAt: string;
  updatedAt: string;
  column: LinkGroup[];
  terms: Link;
  privacy: Link;
  copyright: string;
  socialLinks: SocialLink[];
}>;

const populate = ['column', 'column.links', 'terms', 'privacy', 'socialLinks', 'socialLinks.icon'];

export const getFooter = async ({ locale }: Locale) => {
  const { data } = await strapi.get('/footer', {
    params: {
      populate,
      locale,
    },
  });

  return data;
};

const useGetFooter = ({ locale }: Locale) =>
  useQuery<FooterApiResponse>([GET_FOOTER, locale], () => getFooter({ locale }));

export default useGetFooter;
