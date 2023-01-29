import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { dehydrate, QueryClient } from 'react-query';
import { getFooter, GET_FOOTER } from '../../hooks/api/useGetFooter';
import { getHeader, GET_HEADER } from '../../hooks/api/useGetHeader';
import Layout from '../../components/UI/Layout';
import { DynamicPageProps } from '../../interfaces/api';
import useGetArticles, { getArticles, GET_ARTICLES } from '../../hooks/api/useGetArticles';
import { Layout as LayoutMixin } from '../../components/mixins';
import HeroPost from '../../components/Blog/HeroPost';
import MoreStories from '../../components/Blog/MoreStories';

const StyledLayout = styled(Layout)`
  background-color: ${({ theme }) => theme.colors.extraLightGray};
`;

const StyledWrapper = styled.div`
  ${LayoutMixin};
  padding: 100px 108px;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) and (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding-top: 60px;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 20px 0;
  }
`;

const StyledTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes[10]};
  line-height: ${({ theme }) => theme.lineHeights[6]};
  font-weight: ${({ theme }) => theme.fontWeight[3]};
  margin-bottom: 48px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: ${({ theme }) => theme.fontSizes[7]};
    line-height: ${({ theme }) => theme.lineHeights[5]};
    margin-bottom: 16px;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    text-align: center;
    margin-bottom: 32px;
  }
`;

const StyledMorePostWrapper = styled.div`
  margin: 112px 0;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 80px 0;
  }
`;

const BlogPage = ({ locale }: DynamicPageProps) => {
  const { data } = useGetArticles({ locale });

  return (
    <StyledLayout locale={locale} title='Wimet Blog'>
      <StyledWrapper>
        <StyledTitle>Blog.</StyledTitle>
        {!!data?.[0] && (
          <HeroPost
            title={data?.[0].attributes?.title}
            date={data?.[0].attributes?.createdAt}
            author={data?.[0].attributes?.author?.data?.attributes}
            slug={data?.[0].attributes?.slug}
            description={data?.[0].attributes?.description}
            coverImage={data?.[0].attributes?.image?.data?.attributes?.url}
          />
        )}

        {!!(data || [])?.slice(1)?.length && (data || [])?.slice(1)?.length > 0 && (
          <StyledMorePostWrapper>
            <MoreStories posts={(data || [])?.slice(1)} />
          </StyledMorePostWrapper>
        )}
      </StyledWrapper>
    </StyledLayout>
  );
};

export default BlogPage;

export const getServerSideProps: GetServerSideProps = async context => {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery([GET_ARTICLES, context.locale || ''], () => getArticles({ locale: context.locale })),
    queryClient.prefetchQuery([GET_HEADER, context.locale || ''], () => getHeader({ locale: context.locale })),
    queryClient.prefetchQuery([GET_FOOTER, context.locale || ''], () => getFooter({ locale: context.locale })),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      locale: context.locale,
    },
  };
};
