import { SpaceSchedule } from '@wimet/apps-shared';
import { isToday } from 'date-fns';
import { capitalize } from 'lodash';
import { useMemo } from 'react';
import styled from 'styled-components';
import { getWeekDays } from '../../../../utils/date';
import { SpaceDetailsGrid, SpaceDetailsGridCol, SpaceDetailsGridRow } from '../../SpaceDetailsGrid';

const StyledSpaceDetailsGrid = styled(SpaceDetailsGrid)`
  margin-top: 40px;
  grid-template-columns: repeat(2, auto);
`;

export default function SpaceDetailsDisponibilityMonthlySection({ schedule }: { schedule?: SpaceSchedule[] }) {
  const weekDays = useMemo(() => getWeekDays(), []);

  const getVariant = (day: typeof weekDays[number]) => {
    if (isToday(day.date)) return 'active';
    return undefined;
  };

  const formatTime = (time: string) => {
    const [hour, minutes] = time.split(':');
    const hourNumber = Number(hour);
    const formattedMinutes = `${minutes !== '00' ? `:${minutes}` : ''}`;
    const amOrPm = hourNumber < 12 ? 'am' : 'pm';
    return `${hourNumber % 12 || 12}${formattedMinutes}${amOrPm}.`;
  };

  const groupedComponents = useMemo(
    () =>
      weekDays.reduce(
        (acc, day, i) => {
          const scheduleDay = schedule?.find(d => d.dayOfWeek === i);
          const variant = scheduleDay ? getVariant(day) : 'disabled';

          acc.dayCol.push(
            <SpaceDetailsGridRow key={`${day.name}-day`} variant={variant}>
              {capitalize(day.name)}
            </SpaceDetailsGridRow>
          );

          acc.openCol.push(
            <SpaceDetailsGridRow key={`${day.name}-openTime`} variant={variant}>
              {scheduleDay?.id
                ? `${formatTime(scheduleDay?.openTime || '')} a ${formatTime(scheduleDay?.closeTime || '')}`
                : 'Cerrado'}
            </SpaceDetailsGridRow>
          );

          return acc;
        },
        { dayCol: [] as JSX.Element[], openCol: [] as JSX.Element[] }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [weekDays]
  );

  return (
    <StyledSpaceDetailsGrid>
      <SpaceDetailsGridCol>{groupedComponents.dayCol}</SpaceDetailsGridCol>
      <SpaceDetailsGridCol>{groupedComponents.openCol}</SpaceDetailsGridCol>
    </StyledSpaceDetailsGrid>
  );
}
