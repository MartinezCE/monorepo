import { WPMReservation } from '@wimet/apps-shared';
import styled from 'styled-components';
import SeatInfoPopupAvailable from './SeatInfoPopupAvailable';
import SeatInfoPopupDaypass from './SeatInfoPopupDaypass';

const StyledSeparator = styled.div`
  width: 100%;
  height: 6px;
  background-color: ${({ theme }) => theme.colors.error};
`;

const StyledSeatInfoPopupDaypass = styled(SeatInfoPopupDaypass)`
  background-color: ${({ theme }) => theme.colors.extraLightRed};
`;

type Props = {
  reservation?: WPMReservation;
  isAddedToReserveList?: boolean;
  onReserveClick?: () => void;
  isReservable?: boolean;
};

const SeatInfoPopupHalfday = ({ reservation, ...rest }: Props) => (
  <>
    <SeatInfoPopupAvailable {...rest} />
    <StyledSeparator />
    <StyledSeatInfoPopupDaypass reservation={reservation} />
  </>
);

export default SeatInfoPopupHalfday;
