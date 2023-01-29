import { CompanyBlueprint, Checkbox, Blueprint } from '@wimet/apps-shared';
import Image from 'next/image';
import { useCallback, useMemo } from 'react';
import { Cell, Column, useRowSelect, useTable } from 'react-table';
import styled from 'styled-components';
import { BlueprintsAccess } from '../components/WorkplaceManagerPage/ApplyBlueprintsModal/ApplyBlueprintsModal';
import AmenitiesSelect from '../components/WorkplaceManagerPage/ApplyBlueprintsModal/BlueprintsTable/AmenitiesSelect';
import useSelectedRowIds from './useSelectedRowIds';

const StyledBlueprintWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledImageWrapper = styled.div`
  position: relative;
  width: 75px;
  height: 46px;
  border-radius: 4px;
  overflow: hidden;
`;

const StyledBlueprintText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkGray};
  margin-left: 16px;
`;

const StyledCheckbox = styled(Checkbox)`
  width: 20px;
  height: 20px;
  border-color: ${({ theme }) => theme.colors.blue};
  color: ${({ theme }) => theme.colors.blue};
`;

type Props = {
  initialSelectedBlueprints: BlueprintsAccess['blueprints'];
  companyBlueprints: Blueprint[];
};

const useBlueprintTable = ({ initialSelectedBlueprints, companyBlueprints }: Props) => {
  const data = useMemo(() => companyBlueprints, [companyBlueprints]);
  const selectedRowIds = useSelectedRowIds(data, Object.values(initialSelectedBlueprints));
  const getRowId = useCallback(({ id }) => id.toString(), []);
  const columns = useMemo(
    () => [
      {
        Header: 'Plano',
        Cell: ({ row }: Cell<CompanyBlueprint>) => (
          <StyledBlueprintWrapper>
            <StyledImageWrapper>
              <Image
                src={row.original.url || '/images/placeholder.png'}
                layout='fill'
                objectFit='cover'
                objectPosition='center'
              />
            </StyledImageWrapper>
            <StyledBlueprintText>{row.original.name}</StyledBlueprintText>
          </StyledBlueprintWrapper>
        ),
      },
      {
        Header: 'Amenities',
        Cell: ({ row }: Cell<CompanyBlueprint>) => (
          <AmenitiesSelect blueprintId={row.original.id} isDisabled={!row.isSelected} />
        ),
      },
    ],
    []
  );

  return useTable(
    {
      columns: columns as Column<Blueprint>[],
      data,
      initialState: { selectedRowIds },
      getRowId,
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

export default useBlueprintTable;
