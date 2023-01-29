import { useState } from 'react';
import styled from 'styled-components';
import { FormikProvider, useFormik } from 'formik';
import { GetServerSidePropsContext } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import { LocationStatus } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';
import Layout from '../../components/Layout';
import { liveTabs } from '../../components/LivePage/LivePageHeader/LivePageHeader';
import { LivePageLocation, LivePageHeader, LivePageMap } from '../../components/LivePage';
import { getAllClientLocations, GET_ALL_CLIENT_LOCATIONS } from '../../hooks/api/useGetAllClientLocations';
import { BookingInitialValues } from './office';

const StyledWrapper = styled.div`
  padding: 72px 0px 90px 75px;
`;

const StyledTitle = styled.div`
  font-weight: 500;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.extraDarkBlue};
`;

const StyledContent = styled.div``;

const LivePage = () => {
  const [selectedTab, setSelectedTab] = useState(liveTabs[0]);
  const formik = useFormik({
    initialValues: { selectedDate: new Date(), reservations: [] } as BookingInitialValues,
    onSubmit: () => {},
  });
  return (
    <Layout title='Wimet | Members'>
      <FormikProvider value={formik}>
        <StyledWrapper>
          <StyledTitle>Vista en vivo</StyledTitle>
          <LivePageHeader active={selectedTab} onChange={tab => setSelectedTab(tab)} />
          <StyledContent>
            {selectedTab.id === 'location' && <LivePageLocation />}
            {selectedTab.id === 'map' && <LivePageMap />}
          </StyledContent>
        </StyledWrapper>
      </FormikProvider>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(GET_ALL_CLIENT_LOCATIONS, () =>
    getAllClientLocations(
      { status: LocationStatus.PUBLISHED, floorsRequired: true },
      context.req.headers as AxiosRequestHeaders
    )
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default LivePage;
