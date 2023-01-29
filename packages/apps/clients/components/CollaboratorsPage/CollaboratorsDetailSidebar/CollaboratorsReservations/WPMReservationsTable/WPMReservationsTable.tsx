import React, { useMemo } from 'react';
import { Table, WPMReservation } from '@wimet/apps-shared';
import styled from 'styled-components';
import { Cell, Column, useTable } from 'react-table';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const StyledTable = styled(Table)`
  margin-top: 40px;

  & table {
    & thead {
      background-color: ${({ theme }) => theme.colors.extraLightGray};
    }
    & tbody {
      & tr {
        &:nth-child(even) {
          background-color: ${({ theme }) => theme.colors.extraLightGray};
        }
      }
    }
  }
`;

const StyledSpaceName = styled.div`
  font-weight: 500;
`;
const StyledReserveDate = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.blue};
`;
/* const StyledUsedCredits = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.orange};
`; */
type Props = {
  reservations?: WPMReservation[];
};
const WPMReservationsTable = ({ reservations = [] }: Props) => {
  const columns = useMemo(
    () => [
      {
        Header: 'Locación',
        Cell: ({ row }: Cell<WPMReservation>) => (
          <StyledSpaceName>{row.original.seat?.blueprint?.floor.location?.name}</StyledSpaceName>
        ),
      },
      /*       {
        Header: 'Tipo',
        Cell: ({ row }: Cell<WPMReservation>) => (
          <StyledSpaceName>{row.original.seat?.blueprint?.floor.location?.name}</StyledSpaceName>
        ),
      }, */
      {
        Header: 'Creación',
        accessor: 'createdAt',
        Cell: ({ value }: Cell) => <div>{format(new Date(value), 'dd/MM/yyyy')}</div>,
      },
      {
        Header: 'Reserva',
        Cell: ({ row: { original } }: Cell<WPMReservation>) => (
          <StyledReserveDate>
            {formatInTimeZone(original.startAt, original.destinationTz, 'dd/MM/yyyy')}
          </StyledReserveDate>
        ),
      },
      /*       {
        Header: 'Créditos utilizados',
        accessor: 'usedCredits',
        Cell: ({ value }: Cell) => <StyledUsedCredits>{`${value} créditos`}</StyledUsedCredits>,
      }, */
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns: columns as Column<WPMReservation>[],
    data: reservations,
  });

  return (
    <StyledTable
      rows={rows}
      tableProps={getTableProps()}
      headerGroups={headerGroups}
      prepareRow={prepareRow}
      bodyProps={getTableBodyProps()}
    />
  );
};

export default WPMReservationsTable;
