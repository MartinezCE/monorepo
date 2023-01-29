import React, { useEffect, useMemo } from 'react';
import {
  Button,
  Checkbox,
  Collaborator,
  CollaboratorStatus,
  FiltersButton,
  getUserRoleLabels,
  getCollaboratorStatusLabel,
  images,
  Input,
  pluralize,
  Profile,
  Select,
  StatusBadge,
  Table,
  mixins,
  theme as appTheme,
  useGetMe,
  UserRole,
  getUserRoleDescriptionLabels,
  Switch,
  Plan,
} from '@wimet/apps-shared';
import styled, { css } from 'styled-components';
import { Cell, Column, Row, useRowSelect, useTable } from 'react-table';
import useSwitchUsersWPM from '../../hooks/api/useSwitchUsersWPM';

const StyleListHeaderActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledSearchIcon = styled(images.Search)`
  padding: 14px 0 14px 24px;
  box-sizing: content-box;
  flex-shrink: 0;
`;

const StyledSearchAreaWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`;

const StyledSearchInput = styled(Input)`
  width: 268px;
`;

const StyledCollaboratorsTotalText = styled.div`
  font-size: 14px;
  font-weight: 200;
  margin-left: 24px;
`;

const StyledActionAreaWrapper = styled.div`
  display: flex;
`;

const StyledSortSelect = styled(Select)`
  margin-left: 40px;
  & .react-select__placeholder,
  .react-select__indicators {
    color: ${({ theme }) => theme.colors.darkGray};
    font-weight: 200 !important;
  }
`;

const StyledTable = styled(Table)`
  margin-top: 40px;

  & table {
    & thead {
      & th {
        &:last-child {
          color: transparent;
        }
      }
    }
    & tbody {
      & tr {
        & td {
          &:last-child {
            text-align: right;
            padding-right: 24px;
          }
        }
      }
    }
  }
`;

const StyledProfile = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const StyledProfileData = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  row-gap: 6px;
`;
const StyledProfileName = styled.div`
  font-size: 14px;
  font-weight: 500;
`;
const StyledProfileEmail = styled.div`
  font-size: 12px;
  font-weight: 200;
  color: ${({ theme }) => theme.colors.gray};
`;

const StyledRoleSelect = styled(Select)<{ isDisabled?: boolean }>`
  .react-select__indicators,
  .react-select__placeholder,
  .react-select__single-value,
  .react-select__input {
    color: ${({ theme }) => theme.colors.darkGray};
    font-weight: 200;
  }

  .react-select__control {
    .react-select__indicators svg {
      transition: transform 0.1s linear;
      transform: scale(0.8);
      ${({ isDisabled }) =>
        isDisabled &&
        css`
          visibility: hidden;
        `}
    }
    &--menu-is-open {
      .react-select__indicators svg {
        transform: rotate(180deg) scale(0.8);
      }
    }
  }
`;

const StyledButtonIcon = styled(Button)`
  ${mixins.ButtonIconMixin};
`;

const StyledButtonIconBin = styled(StyledButtonIcon)`
  ${mixins.ButtonIconBinMixin};
  display: table-cell;
`;

const StyledCheckbox = styled(Checkbox)`
  width: 20px;
  height: 20px;
  border-color: ${({ theme }) => theme.colors.blue};
  color: ${({ theme }) => theme.colors.blue};
`;

const sortOptions = [
  {
    label: 'Cargados recientemente',
    value: 'recently',
  },
  {
    label: 'A - Z',
    value: 'az',
  },
  {
    label: 'Z - A',
    value: 'za',
  },
];

const ROLE_OPTIONS = [
  {
    label: getUserRoleLabels(UserRole.ACCOUNT_MANAGER),
    value: 1,
    description: getUserRoleDescriptionLabels(UserRole.ACCOUNT_MANAGER),
  },
  {
    label: getUserRoleLabels(UserRole.TEAM_MANAGER),
    value: 2,
    description: getUserRoleDescriptionLabels(UserRole.TEAM_MANAGER),
  },
  {
    label: getUserRoleLabels(UserRole.MEMBER),
    value: 3,
    description: getUserRoleDescriptionLabels(UserRole.MEMBER),
  },
];

const StyledRoleSelectWrapper = styled.div``;

type Props = {
  plans: Plan[];
  collaborators: Collaborator[];
  showFilters?: boolean;
  onClickAddCollaborator?: () => void;
  onChangeSelectCollaborator?: (selectedCollaborators: Collaborator[]) => void;
  showPlanColumn?: boolean;
  showStatusColumn?: boolean;
  allowAdminDelete?: boolean;
  onClickRow?: (collaborator: Collaborator) => void;
  onClickDelete?: (collaborator: Collaborator) => void;
  disableRolChange?: boolean;
  onClickRole?: (roleId: number, userId: number) => void;
  onClickPlan?: (roleId: number, userId: number) => void;
};

const CollaboratorsTable = ({
  plans = [],
  collaborators = [],
  showFilters = true,
  onClickAddCollaborator,
  onChangeSelectCollaborator,
  showPlanColumn = true,
  showStatusColumn = true,
  allowAdminDelete = false,
  onClickRole,
  onClickPlan,
  onClickRow,
  onClickDelete,
  disableRolChange = false,
}: Props) => {
  const { data: me } = useGetMe();
  const { mutateAsync } = useSwitchUsersWPM(Number(me?.companies[0].id));
  const PLANS_OPTIONS = plans.map(item => ({
    label: item.name,
    value: item.id,
    description: item.name,
  }));

  const handlerValuePlan = (value: number) => {
    const planSelected = plans.find(item => item.id === value)?.name;
    if (!planSelected) {
      return 'Plan no asignado';
    }
    return planSelected;
  };

  const handleSwitchChange = (newValue: boolean, id: number) => mutateAsync({ isWPMEnabled: newValue, users: [id] });

  const columns = useMemo(
    () => [
      {
        Header: 'Perfil',
        Cell: ({ row }: Cell<Collaborator>) => {
          const parsedName = `${row.original.firstName || ''} ${row.original.lastName || ''} ${
            row.original?.id === me?.id ? '(Tú)' : ''
          }`.trim();

          return (
            <StyledProfile onClick={onClickRow ? () => onClickRow(row.original) : undefined}>
              <Profile
                showUserLabel={false}
                variant={row.original.avatarUrl ? 'transparent' : 'gray'}
                borderWidth={1}
                image={row.original.avatarUrl}
              />
              <StyledProfileData>
                {parsedName && <StyledProfileName>{parsedName}</StyledProfileName>}
                <StyledProfileEmail>{row.original.email}</StyledProfileEmail>
              </StyledProfileData>
            </StyledProfile>
          );
        },
      },
      {
        Header: 'Rol',
        accessor: 'userRole',
        Cell: ({ value, row }: Cell<Collaborator>) => (
          <StyledRoleSelectWrapper onClick={e => e.stopPropagation()}>
            <StyledRoleSelect
              onChange={rol => {
                if (row.values.userRole === (rol as { value: number }).value) return;
                onClickRole?.((rol as { value: number }).value, row.original.id);
              }}
              variant='tertiary'
              options={ROLE_OPTIONS}
              placeholder={getUserRoleLabels(value?.value || value)}
              instanceId='sortOptions'
              name={`row[${row.index}].sortBy`}
              alignMenu='center'
              isDisabled={disableRolChange || !row.values.isRegistered}
            />
          </StyledRoleSelectWrapper>
        ),
      },
      {
        Header: 'Plan',
        accessor: 'userPlan',
        Cell: ({ value, row }: Cell<Collaborator>) => (
          <StyledRoleSelectWrapper onClick={e => e.stopPropagation()}>
            <StyledRoleSelect
              onChange={plan => {
                if (row.values.userPlan === (plan as { value: number }).value) return;
                onClickPlan?.((plan as { value: number }).value, row.original.id);
              }}
              variant='tertiary'
              options={PLANS_OPTIONS}
              placeholder={handlerValuePlan(value)}
              instanceId='sortOptions'
              name={`row[${row.index}].sortBy`}
              alignMenu='center'
              isDisabled={disableRolChange || !row.values.isRegistered}
            />
          </StyledRoleSelectWrapper>
        ),
      },
      {
        Header: 'Workplace Manager',
        accessor: 'wpm',
        Cell: ({ row: { original } }: Cell<Collaborator>) => (
          <StyledRoleSelectWrapper>
            <Switch
              disabled={original.userRole === UserRole.ACCOUNT_MANAGER || !original.isRegistered}
              checked={original.isWPMEnabled}
              onChange={() => handleSwitchChange(!original.isWPMEnabled, original.id as number)}
            />
          </StyledRoleSelectWrapper>
        ),
      },
      ...(showStatusColumn
        ? [
            {
              Header: 'Estado',
              accessor: 'isRegistered',
              Cell: ({ value }: Cell) => {
                const status = value ? CollaboratorStatus.REGISTERED : CollaboratorStatus.PENDING;
                return <StatusBadge variant={status}>{getCollaboratorStatusLabel(status)}</StatusBadge>;
              },
            },
          ]
        : []),
      {
        Header: 'Acciones',
        // TODO: create actions row component to wrap all actions
        Cell: ({ row: { original } }: Cell<Collaborator>) => (
          <StyledButtonIconBin
            variant='secondary'
            disabled={!allowAdminDelete && original?.id === me?.id}
            leadingIcon={<images.TinyBin />}
            onClick={e => {
              e.stopPropagation();
              onClickDelete?.(original);
            }}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allowAdminDelete, disableRolChange, me?.id, onClickDelete, onClickRole, showPlanColumn, showStatusColumn]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, selectedFlatRows } = useTable(
    {
      columns: columns as Column<Collaborator>[],
      data: collaborators,
      autoResetSelectedRows: false,
    },
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(currentColumns => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => <StyledCheckbox {...getToggleAllRowsSelectedProps()} />,
          Cell: ({ row }: Cell) => (
            <StyledCheckbox {...row.getToggleRowSelectedProps()} onClick={e => e.stopPropagation()} />
          ),
        },
        ...currentColumns,
      ]);
    }
  );

  useEffect(() => {
    if (!collaborators.length) return;
    const selectedCollaborators = selectedFlatRows.map(row => row.original);
    onChangeSelectCollaborator?.(selectedCollaborators);
  }, [selectedFlatRows]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGetRowProps = (row: Row<Collaborator>) =>
    row?.original?.id === me?.id && {
      style: {
        borderLeft: `2px solid ${appTheme.colors.blue}`,
      },
    };

  return (
    <>
      <StyleListHeaderActions>
        <StyledSearchAreaWrapper>
          <StyledSearchInput
            placeholder='Buscar por nombre o mail'
            name='searchValue'
            leadingAdornment={<StyledSearchIcon />}
          />
          {!!collaborators?.length && (
            <StyledCollaboratorsTotalText>
              {`${pluralize(collaborators.length, 'colaborador', true)} en total`}
            </StyledCollaboratorsTotalText>
          )}
        </StyledSearchAreaWrapper>

        <StyledActionAreaWrapper>
          {showFilters && (
            <>
              <FiltersButton />
              <StyledSortSelect
                variant='tertiary'
                options={sortOptions}
                placeholder='Ordenar por'
                instanceId='sortOptions'
                name='sortBy'
                controlShouldRenderValue={false}
                alignMenu='center'
              />
            </>
          )}
          {!!onClickAddCollaborator && (
            <Button variant='primary' trailingIcon={<images.TinyMore />} onClick={onClickAddCollaborator}>
              Agregar miembro
            </Button>
          )}
        </StyledActionAreaWrapper>
      </StyleListHeaderActions>
      <StyledTable
        rows={rows}
        tableProps={{ ...getTableProps() }}
        headerGroups={headerGroups}
        prepareRow={prepareRow}
        bodyProps={{ ...getTableBodyProps() }}
        getRowProps={handleGetRowProps}
      />
    </>
  );
};

export default CollaboratorsTable;
