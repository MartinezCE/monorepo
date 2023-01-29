import styled from 'styled-components';
import { Amenity, Button, images, Pill, WPMReservation } from '@wimet/apps-shared';
import { formatInTimeZone } from 'date-fns-tz';
import SeatInfoPopupContainer from './SeatInfoPopupContainer';
import ReservationsUser from '../../ReservesPage/ReservesPageHeader/ReservationSidebar/ReservationsUser';

const StyledFeaturesList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const StyledButton = styled(Button)`
  color: ${({ theme }) => theme.colors.darkGray};
  font-weight: ${({ theme }) => theme.fontWeight[1]};
  justify-content: flex-start;
  column-gap: 12px;
`;

const StyledAvailableMobile = styled.div`
  display: flex;
  column-gap: 12px;
  align-items: center;

  .description {
    .title {
      color: ${({ theme }) => theme.colors.darkBlue};
      font-weight: 400;
      font-size: 16px;
    }
  }
`;

const MobileCheckContainer = styled.div`
  background-color: #e6eeff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: solid 0.2em ${({ theme }) => theme.colors.darkBlue};
  display: flex;
  justify-content: center;
  align-items: center;

  .check-icon {
    transform: scale(1.6);
    color: ${({ theme }) => theme.colors.darkBlue};
  }
`;

// TODO: Show calendar when reservations API is ready
// const StyledCalendarIcon = styled(images.TinyCalendar)`
//   color: ${({ theme }) => theme.colors.blue};
// `;

const StyledPill = styled(Pill)`
  border-radius: 4px;
  padding: 6px 8px;
`;

const StyledMoreIcon = styled(images.LightTinyMore)`
  color: ${({ theme }) => theme.colors.blue};
`;

const StyledCheckIcon = styled(images.LightTinyCheck)`
  color: ${({ theme }) => theme.colors.blue};
`;

type Props = {
  className?: string;
  isAddedToReserveList?: boolean;
  amenities?: Amenity[];
  onReserveClick?: () => void;
  isReservable?: boolean;
  isFromMobile?: boolean;
  seatName?: string;
  WPMReservationsData?: WPMReservation[];
};

const SeatInfoPopupAvailable = ({
  className,
  isAddedToReserveList,
  onReserveClick,
  amenities,
  isReservable = true,
  isFromMobile = false,
  seatName,
  WPMReservationsData,
}: Props) => (
  <SeatInfoPopupContainer className={className}>
    {!!amenities?.length && (
      <StyledFeaturesList>
        {amenities.map(a => (
          <StyledPill key={a.id} text={a.name} hideRemoveButton />
        ))}
      </StyledFeaturesList>
    )}
    {isReservable && !isFromMobile && (
      <StyledButton
        variant='secondary'
        leadingIcon={!isAddedToReserveList ? <StyledMoreIcon /> : <StyledCheckIcon />}
        onClick={onReserveClick}
        noBackground>
        Agregar para reservar
      </StyledButton>
    )}
    {isFromMobile && (
      <>
        <StyledAvailableMobile>
          <MobileCheckContainer>
            <images.LightTinyCheck className='check-icon' />
          </MobileCheckContainer>
          <div className='description'>
            <p className='title'>{seatName}</p>
            <p style={{ color: '#0DD268', fontWeight: '400', fontSize: 14 }}>Libre</p>
          </div>
        </StyledAvailableMobile>
        {WPMReservationsData?.map(r => (
          <ReservationsUser
            key={r.id}
            avatarUrl={r.user?.avatarUrl}
            fullName={`${r.user?.firstName || ''} ${r.user?.lastName || ''}`.trim() || 'Unknown user'}
            from={formatInTimeZone(r.startAt, r.destinationTz, 'HH:mm')}
            to={formatInTimeZone(r.endAt, r.destinationTz, 'HH:mm')}
          />
        ))}
      </>
    )}
    {/* TODO: Show calendar when reservations API is ready */}
    {/* <StyledButton variant='secondary' leadingIcon={<StyledCalendarIcon />} noBackground>
        Ver calendario
      </StyledButton> */}
  </SeatInfoPopupContainer>
);

export default SeatInfoPopupAvailable;
