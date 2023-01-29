/* eslint-disable react/no-array-index-key */
import { LoadingSpinner } from '@wimet/apps-shared';
import styled from 'styled-components';
import CustomTableRow, { TypeData } from './CustomTableRow';

const StyleTable = styled.table`
  margin-top: 2rem;
  width: 100%;
  text-align: left;
  font-size: 14px;
  color: #667085;
  background-color: #fff;
  box-shadow: 0px 1px 3px rgb(16 24 40 / 10%), 0px 1px 2px rgb(16 24 40 / 6%);
  border-radius: 8px;
  tr {
    border-bottom: 1px solid #eaecf0;
  }
  th {
    padding: 1rem 1.5rem;
    background: #f9fafb;
  }
`;

type CustomTableProps = {
  headers: string[];
  data: TypeData[][];
  loading?: boolean;
};

export const CustomTable = ({ headers, data, loading = false }: CustomTableProps) => (
  <div>
    {loading ? (
      <LoadingSpinner />
    ) : (
      <StyleTable>
        <tr>
          {headers.map(head => (
            <th key={head}>{head}</th>
          ))}
        </tr>
        {data.map((r, i) => (
          <tr key={i}>
            <CustomTableRow data={r} />
          </tr>
        ))}
      </StyleTable>
    )}
  </div>
);

export default CustomTable;
