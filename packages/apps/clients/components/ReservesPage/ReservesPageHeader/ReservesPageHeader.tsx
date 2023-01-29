import React, { useEffect, useState } from 'react';
import { Button, images } from '@wimet/apps-shared';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import ReservationSidebar from './ReservationSidebar';
import DatePickerPopup from './DatePickerPopup';
import { BookingInitialValues } from '../../../pages/spaces/office';
import DatesPillList from '../../DatesPillList';

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const StyledTitle = styled.div`
  color: ${({ theme }) => theme.colors.extraDarkBlue};
  font-size: 24px;
  font-weight: 500;
`;

const StyledActionsWrapper = styled.div`
  display: flex;
  column-gap: 32px;
`;

const StyledButton = styled(Button)`
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: ${({ theme }) => theme.fontSizes[4]};
  line-height: ${({ theme }) => theme.lineHeights[2]};
  font-weight: ${({ theme }) => theme.fontWeight[0]};
  column-gap: 16px;
`;

const ReservesPageHeader = () => {
  const [showReservationSidebar, setShowReservationSidebar] = useState(false);
  // const [showAvailabilityFilterSidebar, setShowAvailabilityFilterSidebar] = useState(false);
  const { values, touched } = useFormikContext<BookingInitialValues>();

  useEffect(() => {
    if (!touched.reservations) return;
    setShowReservationSidebar(true);
  }, [touched.reservations, values.reservations]);

  return (
    <StyledWrapper>
      <StyledTitle>Disponibilidad</StyledTitle>
      <DatesPillList dates={[values.selectedDate]} />
      <StyledActionsWrapper>
        <DatePickerPopup />
        <StyledButton
          trailingIcon={<images.Reservations />}
          onClick={() => setShowReservationSidebar(true)}
          noBackground>
          Reservas
        </StyledButton>
        {/* <StyledButton
          trailingIcon={<images.Filter />}
          onClick={() => setShowAvailabilityFilterSidebar(true)}
          noBackground>
          Filtros
        </StyledButton> */}
      </StyledActionsWrapper>
      {showReservationSidebar && <ReservationSidebar onClose={() => setShowReservationSidebar(false)} />}
      {/* {showAvailabilityFilterSidebar && (
        <AvailabilityFilterSidebar onClose={() => setShowAvailabilityFilterSidebar(false)} />
      )} */}
    </StyledWrapper>
  );
};

export default ReservesPageHeader;
