/* eslint-disable no-param-reassign */
import { Amenity, Blueprint, Table } from '@wimet/apps-shared';
import { useFormikContext } from 'formik';
import { useEffect } from 'react';
import styled from 'styled-components';
import useWPMAmenitiesTable from '../../../../hooks/useWPMAmenitiesTable';
import { AmenitiesAccess } from '../../ApplyAmenitiesModal/ApplyAmenitiesModal';

const StyledTable = styled(Table)`
  & table > tbody > tr > td:first-child {
    width: 0%;
    white-space: nowrap;
    padding-right: 40px;
  }
`;

type Props = {
  companyAmenities: Amenity[];
  companyBlueprints: Blueprint[];
};

export default function AmenitiesTable({ companyAmenities, companyBlueprints }: Props) {
  const { values, setFieldValue } = useFormikContext<AmenitiesAccess>();
  const { rows, getTableProps, headerGroups, prepareRow, getTableBodyProps, selectedFlatRows } = useWPMAmenitiesTable({
    companyAmenities,
    companyBlueprints,
    initialSelectedAmenities: values.amenities,
  });

  useEffect(() => {
    const newAmenities = selectedFlatRows.map(({ original }) => ({ id: original.id }));

    if (JSON.stringify(values.amenities) === JSON.stringify(newAmenities)) return;

    setFieldValue('amenities', newAmenities);
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
