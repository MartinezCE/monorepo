import { useQuery } from 'react-query';
import qs from 'qs';
import { Locale, StrapiArticle } from '../../interfaces/api';
import { strapi } from '../../strapi';

export const GET_ARTICLES = 'GET_ARTICLES';

export const getArticles = async ({ locale }: Locale) => {
  const params = qs.stringify({
    locale,
    populate: ['category', 'image', 'author', 'author.picture'],
  });

  const { data } = await strapi.get(`/articles?${params}`);

  return data;
};

const useGetArticles = ({ locale }: Locale) =>
  useQuery<StrapiArticle[]>([GET_ARTICLES, locale], () => getArticles({ locale }));

export default useGetArticles;
