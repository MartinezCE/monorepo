import { differenceInHours } from 'date-fns';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getIn, useFormikContext } from 'formik';
import { Plan, pluralize, Space, SpaceReservationHourlyTypes, useGetMe, images } from '@wimet/apps-shared';
import ReservationTypeOption from './ReservationTypeOption';
import SpaceDetailsReserveSidebarBase from '../../SpaceDetailsReserveSidebarBase';
import { typeCredits } from '../utils';
import { SpaceDetailsOnDemandCalendarInitialValues } from '../SpaceDetailsOnDemandCalendar/SpaceDetailsOnDemandCalendar';
import ReservationMessageModal from '../../../ReservationMessageModal';

// TODO: All comments are in regards the all-day logic. Rethink it as some days could not have all types of reservation.

// const StyledCheckBoxWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   margin-top: 32px;
// `;

// const StyledCheckbox = styled(Checkbox)`
//   border-color: ${({ theme }) => theme.colors.blue};
//   color: ${({ theme }) => theme.colors.blue};
// `;

// const StyledCheckboxLabel = styled.div`
//   font-size: 14px;
//   font-weight: 200;
//   margin-left: 12px;
//   color: ${({ theme }) => theme.colors.darkGray};
// `;

const StyledTotalCreditsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px 22px 24px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.extraLightGray};
`;

const StyledTotalAmountText = styled.div`
  color: ${({ theme }) => theme.colors.orange};
  font-size: 16px;
  font-weight: 500;
`;

const StyledIcon = styled(images.WarningTriangle)`
  transform: scale(0.9);
  color: ${({ theme }) => theme.colors.warning};
`;

type Props = {
  space: Partial<Space>;
  isLoading?: boolean;
  onClickClose: () => void;
  onConfirmReservation: () => void;
};

const SpaceDetailsOnDemandSidebar = ({ onClickClose, space, onConfirmReservation, isLoading }: Props) => {
  const [showNoPlanAssignedModal, setShowNoPlanAssignedModal] = useState(false);
  const { values, setFieldValue, setFieldTouched } = useFormikContext<SpaceDetailsOnDemandCalendarInitialValues>();
  const dates: SpaceDetailsOnDemandCalendarInitialValues['days'] = getIn(values, 'days');
  const { data: me } = useGetMe();
  const mePlans = me?.plans as Plan[];
  const calculatedCredits = dates.reduce(
    (acc, el, i) => {
      const { _hourlyMetadata: hourly } = el;
      const perHourStart = values.days[i].perHour?.start;
      const perHourEnd = values.days[i].perHour?.end;
      let hourlyCredits = hourly?.[typeCredits[el.type]] || 0;

      if (el.type === SpaceReservationHourlyTypes.PER_HOUR && perHourStart && perHourEnd) {
        const hourQuantity = Math.abs(differenceInHours(perHourEnd, perHourStart, { roundingMethod: 'round' }));
        hourlyCredits *= hourQuantity;
      }

      acc[i] = hourlyCredits;
      acc.total += acc[i];

      return acc;
    },
    { total: 0 } as { [k: number]: number; total: number }
  );

  useEffect(() => {
    setFieldValue('currentReservationCredits', calculatedCredits.total);
    setFieldTouched('currentReservationCredits', true);
  }, [calculatedCredits.total, setFieldTouched, setFieldValue, values]);

  // const handleAllDays = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   handleChange(e);
  //   setFieldValue('type', e.target.checked ? Object.keys(typeCredits)[0] : '');
  // };

  const isReservationDisabled =
    (mePlans && !mePlans.length) || !!(mePlans && mePlans.length && mePlans[0]?.status !== 'ACTIVE');

  const handleOnConfirmReservation = () => {
    if (isReservationDisabled) {
      setShowNoPlanAssignedModal(true);
    } else {
      onConfirmReservation();
    }
  };

  return (
    <SpaceDetailsReserveSidebarBase
      onClickClose={onClickClose}
      space={space}
      isLoading={isLoading}
      onConfirmReservation={handleOnConfirmReservation}>
      {/* <StyledCheckBoxWrapper>
        <StyledCheckbox name='isAllDays' checked={values.isAllDays} onChange={handleAllDays} />
        <StyledCheckboxLabel>Aplicar a todos los días</StyledCheckboxLabel>
      </StyledCheckBoxWrapper> */}
      {dates.map((date, i) => (
        <ReservationTypeOption
          key={date.day.getTime()}
          hourly={date._hourlyMetadata}
          credits={calculatedCredits[i]}
          date={date.day}
          name={`days[${i}]`}
          reserveTypeSelected={date.type}
          halfDayTypeSelected={date.halfDay}
        />
      ))}
      {/* {values.isAllDays && <ReservationTypeOption date={datesWords.join(', ')} reserveTypeSelected={values.type} />} */}
      <StyledTotalCreditsWrapper>
        <StyledTotalAmountText>Total</StyledTotalAmountText>
        <StyledTotalAmountText>{pluralize(calculatedCredits.total, 'crédito', true)} / persona</StyledTotalAmountText>
      </StyledTotalCreditsWrapper>
      {showNoPlanAssignedModal && (
        <ReservationMessageModal
          title='No tiene un plan asignado para continuar con la reserva.'
          onClickClose={() => setShowNoPlanAssignedModal(false)}
          onAccept={() => setShowNoPlanAssignedModal(false)}
          onAcceptText='Continuar'
          icon={<StyledIcon />}
          text='Comunicate con el responsable de tu empresa para solicitar acceso.'
        />
      )}
    </SpaceDetailsReserveSidebarBase>
  );
};

export default SpaceDetailsOnDemandSidebar;
