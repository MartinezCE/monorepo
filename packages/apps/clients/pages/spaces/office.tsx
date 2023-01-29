import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import styled from 'styled-components';
import { FormikProvider, useFormik } from 'formik';
import { LocationStatus, SpaceTypeEnum, WPMReservationTypes } from '@wimet/apps-shared';
import { BlueprintArea, LocationImageSlideshow, ReservesForm, ReservesPageHeader } from '../../components/ReservesPage';
import { getAllClientLocations, GET_ALL_CLIENT_LOCATIONS } from '../../hooks/api/useGetAllClientLocations';
import Layout from '../../components/Layout';
import useFilterOptions from '../../components/WorkplaceManagerPage/SelectSeatsSection/useFilterOptions';
import useCreateWPMReservations, { CreateWPMReservationPayload } from '../../hooks/api/useCreateWPMReservations';
import { GET_SEATS } from '../../hooks/api/useGetSeats';

const StyledWrapper = styled.div`
  padding: 72px 0 72px 83px;
`;

export type WPMReservationPayload = {
  userId?: number;
  seatId: number;
  startAt: Date;
  metadata: { seatName: string; blueprintName: string; floorNumber: string; spaceType?: SpaceTypeEnum };
};

export type BookingInitialValues = {
  selectedDate: Date;
  reservations: (WPMReservationPayload & { startAt?: Date; endAt?: Date; typeId?: WPMReservationTypes })[];
};

const ReservationsPage = () => {
  const {
    locationOptions,
    currentLocation,
    floorOptions,
    blueprintOptions,
    currentFloor,
    currentBlueprint,
    handleFilters,
  } = useFilterOptions({ fetchAllLocations: true, fetchOnlyPublished: true });
  const { mutateAsync } = useCreateWPMReservations([GET_SEATS, currentBlueprint?.id]);
  const formik = useFormik({
    initialValues: { reservations: [], selectedDate: new Date() } as BookingInitialValues,
    onSubmit: async ({ reservations }, _formik) => {
      try {
        await mutateAsync({ blueprintId: currentBlueprint.id, reservations } as CreateWPMReservationPayload);

        _formik.setFieldValue('reservations', []);
      } catch (e) {
        _formik.setTouched({});
        _formik.setSubmitting(false);
      }
    },
  });

  return (
    <Layout title='Wimet | Members'>
      <FormikProvider value={formik}>
        <StyledWrapper>
          <ReservesPageHeader />
          <ReservesForm
            locationOptions={locationOptions}
            floorOptions={floorOptions}
            blueprintOptions={blueprintOptions}
            currentLocation={currentLocation}
            currentFloor={currentFloor}
            currentBlueprint={currentBlueprint}
            handleFilters={handleFilters}
          />
          <BlueprintArea blueprint={currentBlueprint} floorNumber={currentFloor?.number} />
          <LocationImageSlideshow imageList={currentLocation?.locationFiles?.images || []} />
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

export default ReservationsPage;
