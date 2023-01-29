import { Checkbox, CompanyWPMUser, getUserRoleLabels, Profile, User } from '@wimet/apps-shared';
import { useCallback, useMemo } from 'react';
import { Cell, Column, IdType, useRowSelect, useTable } from 'react-table';
import styled from 'styled-components';
import { handleUserSearch } from '../utils/user';
import useSelectedRowIds from './useSelectedRowIds';

const StyledProfile = styled.div`
  display: flex;
  align-items: center;
`;
const StyledProfileName = styled.div`
  margin-left: 16px;
  font-size: 14px;
  font-weight: 500;
`;

const StyledCheckbox = styled(Checkbox)`
  width: 20px;
  height: 20px;
  border-color: ${({ theme }) => theme.colors.blue};
  color: ${({ theme }) => theme.colors.blue};
`;

const StyledRoleText = styled.div`
  text-align: left;
`;

type Props<T> = {
  users: T[];
  initialSelectedUsers?: T[];
  searchValue?: string;
};

const useUserTable = <T extends CompanyWPMUser | User>({ users, initialSelectedUsers, searchValue = '' }: Props<T>) => {
  const data = useMemo(() => users.filter(us => handleUserSearch(us, searchValue)), [users, searchValue]);
  const selectedRowIds = useSelectedRowIds(users, initialSelectedUsers) as Record<IdType<T>, boolean>;
  const getRowId = useCallback(({ id }) => id.toString(), []);
  const columns = useMemo(
    () => [
      {
        Header: 'Perfil',
        Cell: ({ row }: Cell<T>) => (
          <StyledProfile>
            <Profile
              showUserLabel={false}
              variant={row.original.avatarUrl ? 'transparent' : 'gray'}
              borderWidth={1}
              image={row.original.avatarUrl}
            />
            <StyledProfileName>{`${row.original.firstName} ${row.original.lastName}`}</StyledProfileName>
          </StyledProfile>
        ),
      },
      {
        Header: 'Rol',
        Cell: ({ row }: Cell<T>) =>
          row.original.userRole?.value ? (
            <StyledRoleText>{getUserRoleLabels(row.original.userRole.value)}</StyledRoleText>
          ) : null,
      },
    ],
    []
  );

  return useTable(
    {
      columns: columns as Column<T>[],
      data,
      initialState: { selectedRowIds },
      getRowId,
      autoResetSelectedRows: true,
    },
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(currentColumns => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => <StyledCheckbox {...getToggleAllRowsSelectedProps()} />,
          Cell: ({ row }: Cell) => <StyledCheckbox {...row.getToggleRowSelectedProps()} />,
        },
        ...currentColumns,
      ]);
    }
  );
};

export default useUserTable;
