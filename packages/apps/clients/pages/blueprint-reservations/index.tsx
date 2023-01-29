import React from 'react';
import styled from 'styled-components';
import { FormikProvider, useFormik } from 'formik';
import { SpaceTypeEnum, WPMReservationTypes } from '@wimet/apps-shared';
import { BlueprintArea } from '../../components/ReservesPage';
import useFilterOptions from '../../components/WorkplaceManagerPage/SelectSeatsSection/useFilterOptions';

const StyledWrapper = styled.div`
  min-width: 300px;

  > div,
  > div > div,
  > div > div > div {
    margin-top: unset;
  }
`;

export type WPMReservationPayload = {
  seatId: number;
  startAt: Date;
  metadata: { seatName: string; blueprintName: string; floorNumber: number; spaceType?: SpaceTypeEnum };
};

export type BookingInitialValues = {
  selectedDate: Date;
  reservations: (WPMReservationPayload & { startAt?: Date; endAt?: Date; typeId?: WPMReservationTypes })[];
};

const ReservationsPage = () => {
  const { currentFloor, currentBlueprint, filterMarkersBy, filterByDate } = useFilterOptions({
    fetchAllLocations: true,
    fetchOnlyPublished: true,
  });

  const initialDate = filterByDate ? new Date(filterByDate) : new Date();

  const formik = useFormik({
    initialValues: { reservations: [], selectedDate: initialDate } as BookingInitialValues,
    onSubmit: () => {},
  });

  return (
    <FormikProvider value={formik}>
      <StyledWrapper>
        <BlueprintArea
          hideZoomControl
          filterMarkersBy={filterMarkersBy}
          blueprint={currentBlueprint}
          floorNumber={currentFloor?.number}
          hideHeader
          popupType='custom-mobile'
        />
      </StyledWrapper>
    </FormikProvider>
  );
};

export default ReservationsPage;
