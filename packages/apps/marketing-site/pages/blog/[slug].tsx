import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { dehydrate, QueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import Link from 'next/link';
import { getFooter, GET_FOOTER } from '../../hooks/api/useGetFooter';
import { getHeader, GET_HEADER } from '../../hooks/api/useGetHeader';
import Layout from '../../components/UI/Layout';
import { DynamicPageProps } from '../../interfaces/api';
import { Layout as LayoutMixin } from '../../components/mixins';
import useGetArticle, { getArticle, GET_ARTICLE } from '../../hooks/api/useGetArticle';
import ContentMarkdown from '../../components/Blog/ContentMarkdown';
import { formattedPostDate } from '../../utils/date';
import CoverImage from '../../components/Blog/CoverImage';
import Avatar from '../../components/Blog/Avatar';
import MoreStories from '../../components/Blog/MoreStories';
import Meta from '../../components/Blog/Meta';

const StyledLayout = styled(Layout)`
  background-color: ${({ theme }) => theme.colors.extraLightGray};
`;

const StyledTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes[10]};
  line-height: ${({ theme }) => theme.lineHeights[7]};
  font-weight: ${({ theme }) => theme.fontWeight[3]};
  margin: 70px 0 32px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: ${({ theme }) => theme.fontSizes[7]};
    line-height: ${({ theme }) => theme.lineHeights[5]};
    margin-bottom: 16px;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    text-align: center;
    padding: 0 24px;
  }
`;

const StyledWrapper = styled.div`
  ${LayoutMixin};
  padding: 20px 104px;
  width: 100%;
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: 30px 108px 100px;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 30px 0;
  }
`;

const StyledMorePostWrapper = styled.div`
  margin: 7rem 0;
`;

const StyledContentWrapper = styled.div`
  max-width: 672px;
  margin: 0 auto;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 24px;
  }
`;

const StyledDate = styled.p`
  margin-bottom: 1rem;
`;

const StyledCoverImageWrapper = styled.div`
  margin: 48px 0;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 24px;
  }
`;

const StyledLink = styled.a`
  color: unset;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  font-size: ${({ theme }) => theme.fontSizes[6]};
  line-height: ${({ theme }) => theme.lineHeights[4]};
  font-weight: ${({ theme }) => theme.fontWeight[3]};
  &:hover {
    color: ${({ theme }) => theme.colors.darkBlue};
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 24px;
  }
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledAvatarContent = styled.div`
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    order: 4;
    margin-bottom: 32px;
    padding: 0 24px;
  }
`;

const BlogPage = ({ locale }: DynamicPageProps) => {
  const router = useRouter();
  const { data } = useGetArticle({ slug: router.query.slug as string, locale });

  return (
    <StyledLayout locale={locale} title='Wimet | Discover'>
      <Meta
        title={`Wimet Blog | ${data?.post?.attributes?.title}`}
        description={data?.post?.attributes?.description}
        image={data?.post?.attributes?.image?.data?.attributes?.url}
      />
      <StyledWrapper>
        {data?.post && (
          <>
            <StyledHeader>
              <Link href='/blog' passHref>
                <StyledLink>Blog.</StyledLink>
              </Link>
              <StyledTitle>{data?.post?.attributes?.title}</StyledTitle>
              <StyledAvatarContent>
                <Avatar
                  name={data?.post.attributes.author.data?.attributes?.name}
                  picture={data?.post.attributes.author.data?.attributes?.picture?.data?.attributes.url}
                />
              </StyledAvatarContent>
              <StyledCoverImageWrapper>
                <CoverImage
                  title={data?.post?.attributes?.title}
                  src={data?.post?.attributes?.image?.data?.attributes?.url}
                />
              </StyledCoverImageWrapper>
            </StyledHeader>
            <StyledContentWrapper>
              {data?.post?.attributes?.publishedAt && (
                <StyledDate>
                  {format(new Date(data?.post?.attributes?.publishedAt), formattedPostDate, { locale: es })}
                </StyledDate>
              )}
              <ContentMarkdown content={data?.post?.attributes?.content} />
            </StyledContentWrapper>

            {(data?.morePosts || []).length > 0 && (
              <StyledMorePostWrapper>
                <MoreStories posts={data?.morePosts} />
              </StyledMorePostWrapper>
            )}
          </>
        )}
      </StyledWrapper>
    </StyledLayout>
  );
};

export default BlogPage;

export const getServerSideProps: GetServerSideProps = async context => {
  const slug = context.params?.slug as string;
  const queryClient = new QueryClient();
  const locale = context.locale || '';

  await Promise.all([
    queryClient.prefetchQuery([GET_ARTICLE, locale, slug], () => getArticle({ slug, locale })),
    queryClient.prefetchQuery([GET_HEADER, locale], () => getHeader({ locale })),
    queryClient.prefetchQuery([GET_FOOTER, locale], () => getFooter({ locale })),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
