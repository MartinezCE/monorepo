import { useQuery } from 'react-query';
import qs from 'qs';
import { DynamicPageProps, StrapiArticle } from '../../interfaces/api';
import { strapi } from '../../strapi';

export const GET_ARTICLE = 'GET_ARTICLE';

export const getArticle = async ({ locale, slug }: DynamicPageProps) => {
  const params = qs.stringify({
    filters: {
      slug,
    },
    locale,
    populate: ['category', 'image', 'author', 'author.picture'],
  });

  const paramsMorePosts = qs.stringify(
    {
      filters: {
        slug: {
          $ne: slug,
        },
      },
      pagination: {
        start: 0,
        limit: 2,
      },
      sort: 'createdAt:desc',
      locale,
      populate: ['category', 'image', 'author', 'author.picture'],
    },
    {
      encodeValuesOnly: true,
    }
  );

  const { data } = await strapi.get(`/articles?${params}`);
  const { data: morePosts } = await strapi.get(`/articles?${paramsMorePosts}`);

  return { post: data?.[0], morePosts };
};

const useGetArticle = ({ locale, slug }: DynamicPageProps) =>
  useQuery<{ post: StrapiArticle; morePosts: StrapiArticle[] }>([GET_ARTICLE, locale, slug], () =>
    getArticle({ locale, slug })
  );

export default useGetArticle;
