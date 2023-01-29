import { Select, useGetMe } from '@wimet/apps-shared';
import { useFormikContext } from 'formik';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import useGetSeatAmenities from '../../../../../hooks/api/useGetSeatAmenities';
import { BlueprintsAccess } from '../../ApplyBlueprintsModal';

const StyledSelect = styled(Select)`
  width: 410px;
  > div {
    height: 100%;
    .react-select__control {
      height: 100%;
    }
    .react-select__placeholder {
      width: fit-content;
    }
  }
`;

const AmenitiesSelect = ({ blueprintId, isDisabled }: { blueprintId: number; isDisabled: boolean }) => {
  const { data: userData } = useGetMe();
  const {
    data: companyAmenities = [],
    isLoading,
    refetch,
  } = useGetSeatAmenities(Number(userData?.companies?.[0]?.id), blueprintId, { enabled: false });
  const { values } = useFormikContext<BlueprintsAccess>();
  const amenities = useMemo(
    () => companyAmenities.map(item => ({ value: item.id, label: item.name })),
    [companyAmenities]
  );

  return (
    <StyledSelect
      name={`blueprints[${blueprintId}].amenities`}
      instanceId='blueprintAmenitiesOptions'
      isMulti
      value={values.blueprints[blueprintId]?.amenities}
      isClearable={false}
      options={amenities}
      isDisabled={isDisabled}
      closeMenuOnSelect={false}
      isLoading={isLoading}
      onMenuOpen={refetch}
      maxMenuHeight={200}
    />
  );
};

export default AmenitiesSelect;
