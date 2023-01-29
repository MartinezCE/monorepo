import React, { useMemo } from 'react';
import { PlanRenovation, pluralize, Table } from '@wimet/apps-shared';
import styled from 'styled-components';
import { Cell, Column, useTable } from 'react-table';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { capitalize } from 'lodash';

const StyledTable = styled(Table)`
  margin-top: 32px;
`;

const StyledDescriptionText = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkGray};
`;

// const StyledLink = styled(Link)`
//   color: ${({ theme }) => theme.colors.blue};
//   display: table-cell;
// `;

const StyledAmountText = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.extraDarkBlue};
`;

type Props = {
  renovations: PlanRenovation[];
};

const InvoicesTable = ({ renovations }: Props) => {
  const data = useMemo(() => renovations, [renovations]);
  const columns = useMemo(
    () => [
      {
        Header: 'Mes',
        Cell: ({ row: { original } }: Cell<PlanRenovation>) => (
          <StyledDescriptionText>
            {capitalize(format(parseISO(original.startDate), 'MMMM', { locale: es }))}
          </StyledDescriptionText>
        ),
      },
      {
        Header: 'Descripción',
        Cell: ({ row: { original } }: Cell<PlanRenovation>) => (
          <StyledDescriptionText>
            {pluralize(Number(original.usedCredits), 'crédito', true)} usados
          </StyledDescriptionText>
        ),
      },
      // {
      //   Header: 'Factura',
      //   accessor: 'invoice',
      //   Cell: ({ value }: Cell) => (
      //     <StyledLink href={`/fake-route/invoice/${value.id}`} variant='transparent'>
      //       {value.number}
      //     </StyledLink>
      //   ),
      // },
      // {
      //   Header: 'Fecha',
      //   accessor: 'date',
      //   Cell: ({ value }: Cell) => <div>{format(value, 'dd/MM/yyyy')}</div>,
      // },
      {
        Header: 'Valor',
        Cell: ({ row: { original } }: Cell<PlanRenovation>) =>
          original.values?.map(({ currencyId, currency, value }) => (
            <StyledAmountText key={currencyId}>{`${currency.value} $${value}.-`}</StyledAmountText>
          )),
      },
      // {
      //   Header: 'Estado',
      //   accessor: 'status',
      //   Cell: ({ value }: Cell) => <StatusBadge variant={value}>{`${getInvoiceStatusLabels(value)}`}</StatusBadge>,
      // },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns: columns as Column<PlanRenovation>[],
    data,
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

export default InvoicesTable;
