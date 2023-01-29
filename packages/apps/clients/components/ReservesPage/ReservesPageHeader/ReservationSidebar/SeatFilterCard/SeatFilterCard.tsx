import {
  Button,
  DatePickerInput,
  images,
  Label,
  Select,
  mixins,
  WPMReservationTypeLabels,
  SpaceTypeEnum,
  WPMReservationTypes,
  useGetMe,
} from '@wimet/apps-shared';
import { eachMinuteOfInterval, format, isWithinInterval, set, startOfDay } from 'date-fns';
import { formatInTimeZone, zonedTimeToUtc } from 'date-fns-tz';
import { useFormikContext } from 'formik';
import { useMemo } from 'react';
import styled from 'styled-components';
import useGetSeatWPMReservation from '../../../../../hooks/api/useGetSeatWPMReservation';
import useGetWPMReservationTypes from '../../../../../hooks/api/useGetWPMReservationTypes';
import { BookingInitialValues } from '../../../../../pages/spaces/office';
import ReservationUser from '../ReservationsUser';
import { useGetCompanyUsers } from '../../../../../hooks/api/useGetCompanyUsers';

const StyledSeat = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme: { colors } }) => colors.extraLightGray};
  border-radius: 10px;
  width: 444px;
  padding: 24px;
  gap: 32px;
  > div:last-child {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
`;

const StyledHeaderCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  > div:last-child {
    display: flex;
    flex-direction: row;
    gap: 16px;
  }
`;

const StyledButton = styled(Button)`
  ${mixins.ButtonIconMixin}
  color: ${({ theme: { colors } }) => colors.blue};
`;

const SyledContainerHours = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
  > div:last-child {
    margin-left: 1em;
    width: 100%;
  }
  > div:first-child {
    margin-right: 1em;
    width: 100%;
  }
`;

type SelectDateSeat = {
  value: Date;
  label: string;
};

type Props = {
  index: number;
  seatId: number;
  selectedDate: Date;
  seatName: string;
  blueprintName: string;
  floorNumber: string;
  spaceType?: SpaceTypeEnum;
  removeReservation: (key: number) => void;
};

export default function SeatFilterCard({
  index,
  seatId,
  selectedDate,
  seatName,
  blueprintName,
  floorNumber,
  spaceType,
  removeReservation,
}: Props) {
  const { values } = useFormikContext<BookingInitialValues>();
  const { data: wpmReservationOptions } = useGetWPMReservationTypes({
    select: types =>
      types
        .filter(t => t.name !== WPMReservationTypes.CUSTOM)
        .map(({ id, name }) => ({ value: id, label: WPMReservationTypeLabels[name] })),
  });
  const { data: WPMReservationsData = [] } = useGetSeatWPMReservation(
    seatId,
    { selectedDate },
    { keepPreviousData: true }
  );
  const { data: userData } = useGetMe();
  const { data: users = [] } = useGetCompanyUsers(Number(userData?.companies?.[0]?.id));

  const timeSlots = useMemo(() => {
    const today = startOfDay(values.selectedDate);
    const start = set(today, { hours: 7 });
    const end = set(today, { hours: 20 });
    return eachMinuteOfInterval({ start, end }, { step: 15 }).map<SelectDateSeat>(d => ({
      label: format(d, 'HH:mm'),
      value: d,
    }));
  }, [values.selectedDate]);

  const handleIsOptionDisabled = ({ value }: SelectDateSeat) =>
    WPMReservationsData.some(r =>
      isWithinInterval(value, {
        start: zonedTimeToUtc(r.startAt, r.destinationTz),
        end: zonedTimeToUtc(r.endAt, r.destinationTz),
      })
    );

  return (
    <StyledSeat>
      <StyledHeaderCard>
        <div>
          <h6>{seatName}</h6>
          <Label text={`${blueprintName} - Piso ${floorNumber}`} lowercase variant='secondary' size='small' />
        </div>
        <div>
          {/* <StyledButton onClick={() => {}} trailingIcon={<images.TinyDuplicate />} variant='secondary' /> */}
          <StyledButton onClick={() => removeReservation(index)} trailingIcon={<images.TinyBin />} variant='tertiary' />
        </div>
      </StyledHeaderCard>
      <div>
        <DatePickerInput name={`reservations[${index}].startAt`} label='Fecha' />
        {spaceType !== SpaceTypeEnum.MEETING_ROOM ? (
          <Select
            label='Período'
            options={wpmReservationOptions}
            instanceId='periodSelect'
            name={`reservations[${index}].typeId`}
            placeholder='Seleccione un período'
          />
        ) : (
          <>
            <SyledContainerHours>
              <Select
                label='Hora desde'
                options={timeSlots}
                instanceId='periodSelect'
                name={`reservations[${index}].startAt`}
                placeholder='Hora'
                isOptionDisabled={v => handleIsOptionDisabled(v as SelectDateSeat)}
              />
              <Select
                label='Hora hasta'
                options={timeSlots}
                instanceId='periodSelect'
                name={`reservations[${index}].endAt`}
                placeholder='Hora'
                isOptionDisabled={v => handleIsOptionDisabled(v as SelectDateSeat)}
              />
            </SyledContainerHours>
            {WPMReservationsData.map(r => (
              <ReservationUser
                key={r.id}
                avatarUrl={r.user?.avatarUrl}
                fullName={`${r.user?.firstName || ''} ${r.user?.lastName || ''}`.trim() || 'Unknown user'}
                from={formatInTimeZone(r.startAt, r.destinationTz, 'HH:mm')}
                to={formatInTimeZone(r.endAt, r.destinationTz, 'HH:mm')}
              />
            ))}
          </>
        )}
        <Select
          label='Colaborador'
          options={users.map(({ id, firstName, lastName }) => ({ value: id, label: `${firstName} ${lastName}` }))}
          instanceId='userSelect'
          name={`reservations[${index}].userId`}
          placeholder='Colaborador'
        />
      </div>
    </StyledSeat>
  );
}
