import { Checkbox, Amenity, Blueprint } from '@wimet/apps-shared';
import { useCallback, useMemo } from 'react';
import { Cell, Column, useRowSelect, useTable } from 'react-table';
import styled from 'styled-components';
import { AmenitiesAccess } from '../components/WorkplaceManagerPage/ApplyAmenitiesModal/ApplyAmenitiesModal';
import useSelectedRowIds from './useSelectedRowIds';

const StyledCheckbox = styled(Checkbox)`
  width: 20px;
  height: 20px;
  border-color: ${({ theme }) => theme.colors.blue};
  color: ${({ theme }) => theme.colors.blue};
`;

const StyledText = styled.p`
  text-align: initial;
`;

type Props = {
  initialSelectedAmenities?: AmenitiesAccess['amenities'];
  companyAmenities: Amenity[];
  companyBlueprints: Blueprint[];
};

const useWPMAmenitiesTable = ({ companyAmenities, companyBlueprints, initialSelectedAmenities }: Props) => {
  const blueprints = useMemo(() => companyBlueprints, [companyBlueprints]);
  const data = useMemo(() => {
    if (!blueprints.length || !companyAmenities.length) return [];
    return companyAmenities;
  }, [blueprints.length, companyAmenities]);

  const selectedRowIds = useSelectedRowIds(companyAmenities, initialSelectedAmenities);
  const getRowId = useCallback(({ id }) => id.toString(), []);

  const getBlueprintText = useCallback(
    (amenityBlueprints?: Blueprint[]) => {
      if (!amenityBlueprints?.length) return 'Sin plano asignado';
      if (amenityBlueprints?.length === blueprints.length) return 'Todos';
      return amenityBlueprints.map(({ name }) => name).join(' | ');
    },
    [blueprints.length]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Amenities',
        Cell: ({ row }: Cell<Amenity>) => <StyledText>{row.original.name}</StyledText>,
      },
      {
        Header: 'Plano',
        Cell: ({ row }: Cell<Amenity>) => <StyledText>{getBlueprintText(row.original.blueprints)}</StyledText>,
      },
    ],
    [getBlueprintText]
  );

  return useTable(
    {
      columns: columns as Column<Amenity>[],
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

export default useWPMAmenitiesTable;
