import { BaseFilterSidebar, Button, Label, SpaceTypeEnum } from '@wimet/apps-shared';
import { useFormikContext } from 'formik';
import styled from 'styled-components';
import { BookingInitialValues } from '../../../../pages/spaces/office';
import SeatFilterCard from './SeatFilterCard';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100% - 64px);
`;

const StyledContent = styled.div`
  flex: 1;
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
  gap: 32px;
`;

type Props = {
  onClose: () => void;
};

export default function ReservationSidebar({ onClose }: Props) {
  const formik = useFormikContext<BookingInitialValues>();
  const { reservations } = formik.values;
  const isButtonDisabled =
    formik.isSubmitting ||
    !reservations.length ||
    !reservations.every(r => {
      if (r.metadata.spaceType === SpaceTypeEnum.MEETING_ROOM) return r.startAt && r.endAt && r.userId;
      return r.startAt && r.typeId && r.userId;
    });
  const handleOnClick = async () => {
    if (isButtonDisabled) return;
    await formik.submitForm();
    onClose();
  };
  const handleOnDelete = async (key: number) => {
    reservations.splice(key, 1);
    formik.setFieldValue('reservations', reservations);
  };

  return (
    <BaseFilterSidebar title='Reservas' onClickClose={onClose}>
      <StyledWrapper>
        <StyledContent>
          <Label text={`${reservations.length} en total`} lowercase variant='secondary' size='small' />
          <StyledCardsWrapper>
            {reservations.map(({ seatId, metadata }, i) => (
              <SeatFilterCard
                key={`${seatId}-${i}`} // eslint-disable-line react/no-array-index-key
                index={i}
                seatId={seatId}
                selectedDate={reservations[i].startAt}
                seatName={metadata.seatName}
                blueprintName={metadata.blueprintName}
                floorNumber={metadata.floorNumber}
                spaceType={metadata.spaceType}
                removeReservation={handleOnDelete}
              />
            ))}
          </StyledCardsWrapper>
        </StyledContent>
        <Button onClick={handleOnClick} variant='primary' disabled={isButtonDisabled}>
          Confirmar reserva
        </Button>
      </StyledWrapper>
    </BaseFilterSidebar>
  );
}
