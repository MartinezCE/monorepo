import { Blueprint, Table } from '@wimet/apps-shared';
import { useFormikContext } from 'formik';
import { useEffect } from 'react';
import styled from 'styled-components';
import useBlueprintTable from '../../../../hooks/useBlueprintTable';
import type { BlueprintsAccess } from '../ApplyBlueprintsModal';

const StyledTable = styled(Table)`
  & table > tbody > tr > td:first-child {
    width: 0%;
    white-space: nowrap;
    padding-right: 40px;
  }
`;

type Props = {
  companyBlueprints: Blueprint[];
};

export default function AmenitiesTable({ companyBlueprints }: Props) {
  const { values, setFieldValue } = useFormikContext<BlueprintsAccess>();

  const { rows, getTableProps, headerGroups, prepareRow, getTableBodyProps, selectedFlatRows } = useBlueprintTable({
    initialSelectedBlueprints: values.blueprints,
    companyBlueprints,
  });

  useEffect(() => {
    const newBlueprints = selectedFlatRows.reduce((acc, { original }) => {
      const { id } = original;
      acc[id] = values.blueprints[id] || { id, amenities: [] };
      return acc;
    }, {} as BlueprintsAccess['blueprints']);

    if (JSON.stringify(values.blueprints) === JSON.stringify(newBlueprints)) return;

    setFieldValue('blueprints', newBlueprints);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFlatRows]);

  return (
    <StyledTable
      rows={rows}
      tableProps={getTableProps()}
      headerGroups={headerGroups}
      prepareRow={prepareRow}
      bodyProps={getTableBodyProps()}
    />
  );
}
