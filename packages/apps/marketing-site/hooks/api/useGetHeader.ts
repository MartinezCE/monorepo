import { useQuery } from 'react-query';
import { strapi } from '../../strapi';
import { Locale, StrapiData } from '../../interfaces/api';
import { Link, LinkGroup } from './types';

export const GET_HEADER = 'GET_HEADER';

export type HeaderApiResponse = StrapiData<{
  createdAt: string;
  locale: string;
  publishedAt: string;
  updatedAt: string;
  login: Link;
  register: Link;
  clientLoggedButton: Link;
  partnerLoggedButton: Link;
  requestDemo: Link;
  whyWimet: Link;
  solutionMenu: LinkGroup;
  weAreHiring: Link;
}>;

export const getHeader = async ({ locale }: Locale) => {
  const { data } = await strapi.get('/header', {
    params: {
      locale,
      populate: [
        'login',
        'register',
        'clientLoggedButton',
        'partnerLoggedButton',
        'requestDemo',
        'whyWimet',
        'weAreHiring',
        'solutionMenu',
        'solutionMenu.links',
      ],
    },
  });

  return data;
};

const useGetHeader = ({ locale }: Locale) =>
  useQuery<HeaderApiResponse>([GET_HEADER, locale], () => getHeader({ locale }));

export default useGetHeader;
