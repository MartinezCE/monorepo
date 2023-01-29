/* eslint-disable react/no-array-index-key */
import styled from 'styled-components';
import { dehydrate, QueryClient } from 'react-query';
import { GetServerSidePropsContext } from 'next/types';
import Layout from '../components/UI/Layout';
import useGetPage, { GET_PAGE, getPage } from '../hooks/api/useGetPage';
import { DynamicPageProps, StrapiPageResponse } from '../interfaces/api';
import BlockManager from '../components/BlockManager/BlockManager';
import { useLoggedIntercom } from '../hooks/useLoggedIntercom';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Index = ({ locale, slug }: DynamicPageProps) => {
  const { data: { attributes } = {} as StrapiPageResponse } = useGetPage({ locale, slug });
  useLoggedIntercom();

  return (
    <Layout locale={locale} title='Wimet | Home' isFluid={false}>
      <StyledWrapper>
        {attributes?.blocks?.map((block, i) => (
          <BlockManager key={`${block.id}-${i}`} {...block} />
        ))}
      </StyledWrapper>
    </Layout>
  );
};

export async function getServerSideProps({ locale, params }: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  const slug = Object.keys(params || {}).length === 0 ? '/' : (params?.slug as string[]).join('/');

  await queryClient.prefetchQuery([GET_PAGE, locale || '', slug], () => getPage({ locale, slug }));

  const page = queryClient.getQueryData<StrapiPageResponse>([GET_PAGE, locale, slug]);

  if (!page) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      locale,
      slug,
    },
  };
}

export default Index;
