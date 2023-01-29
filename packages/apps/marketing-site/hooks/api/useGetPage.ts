import { useQuery } from 'react-query';
import qs from 'qs';
import { DynamicPageProps, StrapiPageResponse } from '../../interfaces/api';
import { strapi } from '../../strapi';

export const GET_PAGE = 'GET_PAGE';

export const getPage = async ({ locale, slug }: DynamicPageProps) => {
  const params = qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    locale,
  });

  const { data } = await strapi.get(`/pages?${params}`);

  return data?.[0];
};

const useGetPage = ({ locale, slug }: DynamicPageProps) =>
  useQuery<StrapiPageResponse>([GET_PAGE, locale, slug], () => getPage({ locale, slug }));

export default useGetPage;
