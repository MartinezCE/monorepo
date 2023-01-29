/* eslint-disable consistent-return */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  DatePicker,
  SpaceReservationHourlyTypes,
  SpaceReservationHalfDayTypes,
  useGetMe,
  UserStatus,
  pluralize,
  Hourly,
  Space,
  Plan,
} from '@wimet/apps-shared';
import styled from 'styled-components';
import * as Yup from 'yup';
import { FormikProvider, useFormik } from 'formik';
import { differenceInHours, getDay } from 'date-fns';
import SpaceDetailsReserveCard from '../../SpaceDetailsReserveCard';
import useDateList from '../../../../hooks/useDateList';
import { typeCredits } from '../utils';
import SpaceDetailsOnDemandSidebar from '../SpaceDetailsOnDemandSidebar';
import useCreateSpaceReservation from '../../../../hooks/api/useCreateSpaceReservation';

const StyledSelectedDatesTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  margin-bottom: 32px;
`;

const StyledSelectedDatesText = styled.div`
  text-align: center;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.orange};
  margin-bottom: 4px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const initialValues = {
  currentReservationCredits: 0,
  _maxReservationCredits: 0,
  days: [] as {
    day: Date;
    hourlyId: number;
    _hourlyMetadata: Hourly;
    type: SpaceReservationHourlyTypes;
    perHour?: { start: Date; end: Date; _minHoursAmount: number };
    halfDay?: SpaceReservationHalfDayTypes;
  }[],
};

export type SpaceDetailsOnDemandCalendarInitialValues = typeof initialValues;

const validationSchema = Yup.object().shape({
  currentReservationCredits: Yup.number().max(
    Yup.ref('_maxReservationCredits'),
    'El total de créditos de las reservas seleccionadas excede el máximo de créditos permitidos por tu plan'
  ),
  days: Yup.array().of(
    Yup.object().shape({
      perHour: Yup.object().when('type', {
        is: SpaceReservationHourlyTypes.PER_HOUR,
        then: Yup.object()
          .shape({
            start: Yup.date(),
            end: Yup.date().min(Yup.ref('start'), 'La hora de fin debe ser posterior a la hora de inicio'),
          })
          .test('end-after-start-with-min-hours', (value, ctx) => {
            const { start, end, _minHoursAmount: minHours } = value as typeof value & { _minHoursAmount: number };

            if (start && end && differenceInHours(end, start) < minHours) {
              return ctx.createError({
                path: `${ctx.path}.end`,
                message: `El espacio requiere que las reservas sean de al menos ${pluralize(minHours, 'hora', true)}`,
              });
            }
            return true;
          }),
      }),
    })
  ),
});

type Props = {
  space: Partial<Space>;
  filterDate?: (date: Date) => boolean;
  onConfirmReservation: () => void;
};

const SpaceDetailsOnDemandCalendar = ({ space, filterDate, onConfirmReservation }: Props) => {
  const { query, push } = useRouter();
  const { data: user } = useGetMe();
  const { spaceId } = query as { spaceId: string };

  const [showSidebar, setShowSidebar] = useState(false);
  const { mutateAsync: createReservation, isLoading: isCreatingReserve } = useCreateSpaceReservation(spaceId);

  const { handleCheckboxListChange, list, description } = useDateList({ initialDateList: [] });

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      _maxReservationCredits: (user?.plans[0] as Plan)?.maxReservationCredits,
    },
    validationSchema,
    onSubmit: ({ days }) => createReservation({ spaceId, hourly: days }),
  });

  const handleOnChange = (date: Date) => {
    handleCheckboxListChange(date);
  };

  const handleOnConfirmReservation = async () => {
    if (user?.status !== UserStatus.APPROVED) return push(user?.profileUrl || '/');
    await formik.submitForm();
    setShowSidebar(false);
    onConfirmReservation?.();
  };

  const getHourlyByDay = (date: Date) => {
    const dateOfWeek = getDay(new Date(date)) ? getDay(new Date(date)) - 1 : 6;
    return (space.hourly || []).find(s => s.dayOfWeek === dateOfWeek);
  };

  useEffect(() => {
    formik.setFieldValue(
      'days',
      list.map(item => {
        const hourly = getHourlyByDay(item) || ({} as Hourly);
        const defaultSelectedType = Object.entries(typeCredits).find(([, v]) => !!hourly[v]);
        return {
          day: item,
          type: defaultSelectedType?.[0],
          hourlyId: hourly?.id,
          _hourlyMetadata: getHourlyByDay(item),
        };
      })
    );
  }, [list]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SpaceDetailsReserveCard
      onClickReserve={() => {
        window.scrollTo(0, 0);
        setShowSidebar(true);
      }}
      disableButton={!list.length}>
      <FormikProvider value={formik}>
        <DatePicker filterDate={filterDate} onChange={handleOnChange} highlightedDates={list} minDate={new Date()} />
        <StyledSelectedDatesTextWrapper>
          {description.map(date => (
            <StyledSelectedDatesText key={date}>{date.toString()}</StyledSelectedDatesText>
          ))}
        </StyledSelectedDatesTextWrapper>
        {showSidebar && (
          <SpaceDetailsOnDemandSidebar
            space={space}
            onConfirmReservation={handleOnConfirmReservation}
            onClickClose={() => setShowSidebar(false)}
            isLoading={isCreatingReserve}
          />
        )}
      </FormikProvider>
    </SpaceDetailsReserveCard>
  );
};

export default SpaceDetailsOnDemandCalendar;
