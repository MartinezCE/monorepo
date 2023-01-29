import {
  Profile,
  WPMReservation,
  WPMReservationTypeLiveMapLabels,
  WPMReservationTypes,
  images,
} from '@wimet/apps-shared';
import { formatInTimeZone } from 'date-fns-tz';
import styled from 'styled-components';
import LiveMapPopupBase from '../LiveMapPopupBase';

const StyledProfile = styled(Profile)`
  justify-content: center;
  align-items: center;
  cursor: auto;

  > div > div {
    width: 34px;
    height: 34px;
  }
`;

const StyledContentRow = styled.div`
  display: flex;
  column-gap: 12px;
  align-items: center;
`;

const StyledContentRowDate = styled(StyledContentRow)`
  color: ${({ theme }) => theme.colors.gray};
`;

const StyledContentColumn = styled.div`
  display: flex;
  row-gap: 4px;
  flex-direction: column;
`;

type Props = {
  reservations: WPMReservation[];
};

const LiveMapPopup = ({ reservations }: Props) => {
  const { name, address } = reservations[0].seat?.blueprint?.floor.location || {};
  const reservationsQuantity = reservations.length;

  return (
    <LiveMapPopupBase name={name} address={address?.substring(0, address.indexOf(','))}>
      {reservations.map(r => {
        const { avatarUrl } = r.user || {};
        const reservationType = r.WPMReservationType?.name as keyof typeof WPMReservationTypes;
        return (
          <StyledContentRow key={r.id}>
            {reservationsQuantity > 1 ? (
              <StyledProfile
                showUserLabel={false}
                variant={avatarUrl ? 'transparent' : 'gray'}
                borderWidth={1}
                size='medium'
                image={avatarUrl}
              />
            ) : (
              <images.Reservation />
            )}
            <StyledContentColumn>
              <StyledContentRowDate>{formatInTimeZone(r.startAt, r.destinationTz, 'dd/MM/yyyy')}</StyledContentRowDate>
              <StyledContentRow>
                {WPMReservationTypeLiveMapLabels[WPMReservationTypes[reservationType]]}
              </StyledContentRow>
            </StyledContentColumn>
          </StyledContentRow>
        );
      })}
    </LiveMapPopupBase>
  );
};

export default LiveMapPopup;
