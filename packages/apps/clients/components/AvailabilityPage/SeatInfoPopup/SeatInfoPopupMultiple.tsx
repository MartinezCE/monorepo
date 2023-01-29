import { Text, WPMReservation, WPMReservationTypeLabels, WPMReservationTypes } from '@wimet/apps-shared';
import { formatInTimeZone } from 'date-fns-tz';
import styled from 'styled-components';
import SeatInfoPopupAvatarRow from './SeatInfoPopupAvatarRow';
import SeatInfoPopupContainer from './SeatInfoPopupContainer';

const StyledColumn = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

const StyledOverlineText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes[0]};
  line-height: ${({ theme }) => theme.lineHeights[0]};
`;

type Props = {
  reservations?: WPMReservation[];
};

const SeatInfoPopupMultiple = ({ reservations }: Props) => (
  <SeatInfoPopupContainer>
    {reservations?.map(r => {
      const { avatarUrl, firstName, lastName } = r.user || {};
      const reservationType = WPMReservationTypeLabels[r.WPMReservationType?.name as keyof typeof WPMReservationTypes];
      const formattedDate = formatInTimeZone(r.startAt, r.destinationTz, 'd/M/yy');

      return (
        <StyledColumn key={r.id}>
          <StyledOverlineText>
            <b>{formattedDate}</b> - {reservationType}
          </StyledOverlineText>
          <SeatInfoPopupAvatarRow avatarUrl={avatarUrl} firstName={firstName} lastName={lastName} />
        </StyledColumn>
      );
    })}
  </SeatInfoPopupContainer>
);

export default SeatInfoPopupMultiple;
