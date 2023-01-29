import { useGroupDays, SpaceSchedule } from '@wimet/apps-shared';
import { isToday } from 'date-fns';
import { useMemo } from 'react';
import styled from 'styled-components';
import { getDaysIntervalText, getWeekDays } from '../../../../utils/date';
import {
  SpaceDetailsGrid,
  SpaceDetailsGridCol,
  SpaceDetailsGridHeaderRow,
  SpaceDetailsGridRow,
} from '../../SpaceDetailsGrid';

const StyledSpaceDetailsGrid = styled(SpaceDetailsGrid)`
  margin-top: 16px;
  grid-template-columns: minmax(0, 284px) repeat(2, max-content);
`;

export default function SpaceDetailsDisponibilityHourlySection({ schedule }: { schedule?: SpaceSchedule[] }) {
  const weekDays = useMemo(() => getWeekDays(), []);
  const groups = useGroupDays({
    days: [...(schedule || [])]?.sort((a, b) => (a?.dayOfWeek || 0) - (b?.dayOfWeek || 0)) || [],
  });
  const disabledDays = useMemo(
    () => weekDays.filter((_, i) => !schedule?.some(d => d.dayOfWeek === i)).map(d => d.name),
    [schedule, weekDays]
  );

  const getVariant = (group: typeof groups[number]) => {
    if (group.daysOfWeek.some(d => isToday(weekDays[d].date))) return 'active';
    return undefined;
  };

  const groupedComponents = useMemo(
    () =>
      groups.reduce(
        (acc, group) => {
          const variant = getVariant(group);
          const text = getDaysIntervalText(group);

          acc.dayCol.push(
            <SpaceDetailsGridRow key={`${group.id}-days`} variant={variant}>
              {text}
            </SpaceDetailsGridRow>
          );

          acc.openCol.push(
            <SpaceDetailsGridRow key={`${group.id}-openTime`} variant={variant}>
              {group.is24Open ? 'Disponible 24 hs.' : `${group.openTime?.replace(/:[^:]*$/, '')} hs`}
            </SpaceDetailsGridRow>
          );

          acc.closeCol.push(
            <SpaceDetailsGridRow key={`${group.id}-closeTime`} variant={variant}>
              {group.is24Open ? '' : `${group.closeTime?.replace(/:[^:]*$/, '')} hs`}
            </SpaceDetailsGridRow>
          );

          return acc;
        },
        { dayCol: [] as JSX.Element[], openCol: [] as JSX.Element[], closeCol: [] as JSX.Element[] }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groups]
  );

  return (
    <StyledSpaceDetailsGrid>
      <SpaceDetailsGridCol>
        <SpaceDetailsGridHeaderRow />
        {groupedComponents.dayCol}
        {!!disabledDays.length && (
          <SpaceDetailsGridRow variant='disabled'>{new Intl.ListFormat().format(disabledDays)}</SpaceDetailsGridRow>
        )}
      </SpaceDetailsGridCol>
      <SpaceDetailsGridCol>
        <SpaceDetailsGridHeaderRow>Desde</SpaceDetailsGridHeaderRow>
        {groupedComponents.openCol}
        {!!disabledDays.length && <SpaceDetailsGridRow variant='disabled'>Cerrado</SpaceDetailsGridRow>}
      </SpaceDetailsGridCol>
      <SpaceDetailsGridCol>
        <SpaceDetailsGridHeaderRow>Hasta</SpaceDetailsGridHeaderRow>
        {groupedComponents.closeCol}
        {!!disabledDays.length && <SpaceDetailsGridRow variant='disabled' />}
      </SpaceDetailsGridCol>
    </StyledSpaceDetailsGrid>
  );
}
