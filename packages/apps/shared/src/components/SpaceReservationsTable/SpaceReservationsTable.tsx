import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Cell, Column, useTable } from 'react-table';
import { formatInTimeZone } from 'date-fns-tz';
import Table from '../Table';
import { HourlySpaceReservation } from '../../types';
import { pluralize, SpaceReservationHourlyLabels, spaceTypeFilterLabels } from '../../utils';
import Profile from '../Profile';
import Label from '../Label';

const StyledColumn = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const StyledProfile = styled(StyledColumn)`
  > div:last-child {
    display: flex;
    flex-direction: column;
  }
`;

const StyledEmailLabel = styled(Label)`
  font-weight: 200;
`;

type ColumnIds =
  | 'user'
  | 'reservationType'
  | 'locationName'
  | 'spaceName'
  | 'spaceType'
  | 'startDate'
  | 'endDate'
  | 'credits';

type Props = {
  reservations?: HourlySpaceReservation[];
  className?: string;
  hiddenColumns?: ColumnIds[];
};
const SpaceReservationsTable = ({ reservations = [], className, hiddenColumns = [] }: Props) => {
  const columns = useMemo(
    () => [
      {
        id: 'user',
        Header: 'Usuario',
        Cell: ({
          row: {
            original: { user },
          },
        }: Cell<HourlySpaceReservation>) => (
          <StyledProfile>
            <Profile
              showUserLabel={false}
              variant={user?.avatarUrl ? 'transparent' : 'gray'}
              borderWidth={1}
              image={user?.avatarUrl}
            />
            <div>
              <Label text={`${user.firstName} ${user.lastName}`} variant='currentColor' size='large' lowercase />
              <StyledEmailLabel text={user.email} variant='secondary' size='large' lowercase />
            </div>
          </StyledProfile>
        ),
      },
      {
        id: 'reservationType',
        Header: 'Tipo',
        Cell: ({ row }: Cell<HourlySpaceReservation>) => (
          <StyledColumn>
            <p>{SpaceReservationHourlyLabels[row.original.type]}</p>
          </StyledColumn>
        ),
      },
      {
        id: 'locationName',
        Header: 'Locación',
        Cell: ({ row }: Cell<HourlySpaceReservation>) => (
          <StyledColumn>
            <p>{row.original.space.location.name}</p>
          </StyledColumn>
        ),
      },
      {
        id: 'spaceName',
        Header: 'Espacio',
        Cell: ({ row }: Cell<HourlySpaceReservation>) => <StyledColumn>{row.original.space.name}</StyledColumn>,
      },
      {
        id: 'spaceType',
        Header: 'Tipo de espacio',
        Cell: ({ row }: Cell<HourlySpaceReservation>) => (
          <StyledColumn>
            <p>{spaceTypeFilterLabels[row.original.space.spaceType?.value]}</p>
          </StyledColumn>
        ),
      },
      {
        id: 'startDate',
        Header: 'Inicio de la reserva',
        Cell: ({ row }: Cell<HourlySpaceReservation>) => (
          <StyledColumn>
            <p>{formatInTimeZone(row.original.startDate, row.original.destinationTz, "dd/MM/yyyy 'a las' HH:mm")}</p>
          </StyledColumn>
        ),
      },
      {
        id: 'endDate',
        Header: 'Fin de la reserva',
        Cell: ({ row }: Cell<HourlySpaceReservation>) => (
          <StyledColumn>
            <p>
              {row.original.endDate
                ? formatInTimeZone(row.original.endDate, row.original.destinationTz, "dd/MM/yyyy 'a las' HH:mm")
                : '-'}
            </p>
          </StyledColumn>
        ),
      },
      {
        id: 'credits',
        Header: 'Créditos usados',
        Cell: ({ row }: Cell<HourlySpaceReservation>) => (
          <StyledColumn>
            <p>{pluralize(row.original.usedCredits, 'crédito', true)}</p>
          </StyledColumn>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns: columns as Column<HourlySpaceReservation>[],
    data: reservations,
    initialState: { hiddenColumns },
  });

  return (
    <Table
      rows={rows}
      tableProps={getTableProps()}
      headerGroups={headerGroups}
      prepareRow={prepareRow}
      bodyProps={getTableBodyProps()}
      className={className}
    />
  );
};

export default SpaceReservationsTable;
