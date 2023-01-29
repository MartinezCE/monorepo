/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styled, { css } from 'styled-components';

const StyledWrapper = styled.div`
  & table {
    width: 100%;

    & thead {
      background-color: ${({ theme }) => theme.colors.white};
      & th {
        text-align: left;
        padding-top: 12px;
        padding-bottom: 12px;
        font-weight: 500;
        color: ${({ theme }) => theme.colors.darkGray};
        font-size: 14px;
        &:first-child {
          border-top-left-radius: 4px;
          padding-left: 24px;
        }
        &:last-child {
          border-top-right-radius: 4px;
        }
      }
    }

    & tbody {
      & tr {
        &:nth-child(odd) {
          background-color: rgba(255, 255, 255, 0.3);
        }
        &:nth-child(even) {
          background: ${({ theme }) => theme.colors.white};
        }
        & td {
          padding-top: 16px;
          padding-bottom: 16px;
          vertical-align: middle;
          font-size: 14px;
          color: ${({ theme }) => theme.colors.darkGray};
          font-weight: 200;
          &:first-child {
            padding-left: 24px;
          }
        }
      }
    }
  }
`;

type TrProps = {
  canBeClicked?: boolean;
};

const StyledTr = styled.tr<TrProps>`
  ${({ canBeClicked }) =>
    canBeClicked &&
    css`
      cursor: pointer;
      &:hover {
        background-color: ${({ theme }) => theme.colors.extraLightBlue} !important;
      }
    `}
`;

type Props = {
  className?: string;
  tableProps: any;
  bodyProps: any;
  headerGroups: Array<any>;
  rows: Array<any>;
  prepareRow: (row: any) => any;
  getRowProps?: (row: any) => any;
  onClickRow?: (row: any) => void;
};

const defaultPropGetter = () => ({});

const Table = ({
  className,
  tableProps,
  headerGroups,
  bodyProps,
  prepareRow,
  rows,
  onClickRow,
  getRowProps = defaultPropGetter,
}: Props) => (
  <StyledWrapper className={className}>
    <table {...tableProps}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr key={headerGroup.Header} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th key={column.accessor} {...column.getHeaderProps()}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...bodyProps}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <StyledTr
              key={row.index}
              {...row.getRowProps(getRowProps(row))}
              onClick={() => onClickRow?.(row)}
              canBeClicked={onClickRow}>
              {row.cells.map((cell, i) => {
                const index = i;
                return (
                  <td key={index} {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </StyledTr>
          );
        })}
      </tbody>
    </table>
  </StyledWrapper>
);

export default Table;
