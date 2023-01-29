import { pluralize, useGroupDays, Space } from '@wimet/apps-shared';
import { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { getDaysIntervalText } from '../../../../utils/date';
import {
  SpaceDetailsGrid,
  SpaceDetailsGridCol,
  SpaceDetailsGridHeaderRow,
  SpaceDetailsGridRow,
  SpaceDetailsGridSeparator,
} from '../../SpaceDetailsGrid';

const StyledSpaceDetailsGrid = styled(SpaceDetailsGrid)`
  margin-top: 24px;
  grid-template-columns: 1fr auto 1px auto 1px auto;
  column-gap: 25px;
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    column-gap: 45px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: auto 1px auto 1px auto;
  }
`;

const StyledSpaceDetailsGridHeaderRow = styled(SpaceDetailsGridHeaderRow)`
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StyledMobileGridTitle = styled.div`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    margin: 20px 0 10px 0;
    > div {
      font-weight: bold;
    }
  }
`;

const StyledSpaceDetailsGridRow = styled(SpaceDetailsGridRow)`
  ${({ variant }) =>
    variant === 'active' &&
    css`
      color: ${({ theme }) => theme.colors.blue};
      font-weight: ${({ theme }) => theme.fontWeight[0]};

      b > {
        font-weight: ${({ theme }) => theme.fontWeight[2]};
      }
    `}
`;

const StyledSpaceDetailsGridCol = styled(SpaceDetailsGridCol)`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export default function SpaceDetailsCreditsHourlySection({ credits }: { credits?: Space['hourly'] }) {
  const groups = useGroupDays({ days: [...(credits || [])]?.sort((a, b) => a.dayOfWeek - b.dayOfWeek) || [] });

  const groupedComponents = useMemo(
    () =>
      groups.reduce(
        (acc, group) => {
          acc.dayCol.push(
            <StyledSpaceDetailsGridRow key={`${group.id}-days`}>{getDaysIntervalText(group)}</StyledSpaceDetailsGridRow>
          );

          acc.hourCol.push(
            <StyledSpaceDetailsGridRow key={`${group.id}-hour`} variant='active'>
              {group.dayCreditsWithFee ? (
                <>
                  <b>{group.dayCreditsWithFee}</b> {pluralize(group.dayCreditsWithFee, 'crédito')}
                </>
              ) : (
                '-'
              )}
            </StyledSpaceDetailsGridRow>
          );

          acc.halfDayCol.push(
            <StyledSpaceDetailsGridRow key={`${group.id}-halfday`} variant='active'>
              {group.halfDayCreditsWithFee ? (
                <>
                  <b>{group.halfDayCreditsWithFee}</b> {pluralize(group.halfDayCreditsWithFee, 'crédito')}
                </>
              ) : (
                '-'
              )}
            </StyledSpaceDetailsGridRow>
          );

          acc.fullDayCol.push(
            <StyledSpaceDetailsGridRow key={`${group.id}-fullDay`} variant='active'>
              {group.fullDayCreditsWithFee ? (
                <>
                  <b>{group.fullDayCreditsWithFee}</b> {pluralize(group.fullDayCreditsWithFee, 'crédito')}
                </>
              ) : (
                '-'
              )}
            </StyledSpaceDetailsGridRow>
          );

          return acc;
        },
        {
          dayCol: [] as JSX.Element[],
          hourCol: [] as JSX.Element[],
          halfDayCol: [] as JSX.Element[],
          fullDayCol: [] as JSX.Element[],
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groups]
  );

  return (
    <>
      <StyledMobileGridTitle>{groupedComponents.dayCol}</StyledMobileGridTitle>
      <StyledSpaceDetailsGrid>
        <StyledSpaceDetailsGridCol>
          <StyledSpaceDetailsGridHeaderRow />
          {groupedComponents.dayCol}
        </StyledSpaceDetailsGridCol>
        <SpaceDetailsGridCol>
          <StyledSpaceDetailsGridHeaderRow>Hora</StyledSpaceDetailsGridHeaderRow>
          {groupedComponents.hourCol}
        </SpaceDetailsGridCol>
        <SpaceDetailsGridSeparator />
        <SpaceDetailsGridCol>
          <StyledSpaceDetailsGridHeaderRow>Medio día</StyledSpaceDetailsGridHeaderRow>
          {groupedComponents.halfDayCol}
        </SpaceDetailsGridCol>
        <SpaceDetailsGridSeparator />
        <SpaceDetailsGridCol>
          <StyledSpaceDetailsGridHeaderRow>Daypass</StyledSpaceDetailsGridHeaderRow>
          {groupedComponents.fullDayCol}
        </SpaceDetailsGridCol>
      </StyledSpaceDetailsGrid>
    </>
  );
}
