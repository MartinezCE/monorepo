import React, { useMemo } from 'react';
import { HourlySpaceReservation, Link, Table } from '@wimet/apps-shared';
import styled from 'styled-components';
import { Cell, Column, useTable } from 'react-table';
import { formatInTimeZone } from 'date-fns-tz';

const StyledTable = styled(Table)`
  margin-top: 32px;
`;

const StyledSpaceText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StyledUsedCreditsText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.orange};
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.blue};
  display: table-cell;
`;

type Props = {
  reservations: HourlySpaceReservation[];
};

const ReservesTable = ({ reservations }: Props) => {
  const columns = useMemo(
    () => [
      {
        Header: 'Espacio',
        accessor: 'space',
        Cell: ({ value }: Cell<HourlySpaceReservation['space']>) => <StyledSpaceText>{value.name}</StyledSpaceText>,
      },
      {
        Header: 'Fecha de reserva',
        Cell: ({ row: { original } }: Cell<HourlySpaceReservation>) => (
          <div>{formatInTimeZone(original.startDate, original.destinationTz, 'dd/MM/yyyy')}</div>
        ),
      },
      {
        Header: 'Créditos utilizados',
        Cell: ({ row: { original } }: Cell<HourlySpaceReservation>) => (
          <StyledUsedCreditsText>{`${original.usedCredits} créditos`}</StyledUsedCreditsText>
        ),
      },
      // {
      //   Header: 'Créditos sobrantes',
      //   accessor: 'leftCredits',
      // },
      {
        Header: 'Miembro',
        Cell: ({ row: { original } }: Cell<HourlySpaceReservation>) => (
          <StyledLink href={`/company/collaborators?collaboratorId=${original.user?.id}`} variant='transparent'>
            {`${original.user?.firstName} ${original.user?.lastName} `}
          </StyledLink>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns: columns as Column<HourlySpaceReservation>[],
    data: reservations,
  });

  return (
    <StyledTable
      rows={rows}
      tableProps={{ ...getTableProps() }}
      headerGroups={headerGroups}
      prepareRow={prepareRow}
      bodyProps={{ ...getTableBodyProps() }}
    />
  );
};

export default ReservesTable;
