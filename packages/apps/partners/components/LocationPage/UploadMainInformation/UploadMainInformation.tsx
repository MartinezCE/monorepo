import React, { useEffect, useRef } from 'react';
import {
  getSpaceTypeLabel,
  InputNumber,
  Select,
  spaceReservationLabels,
  SpaceTypeEnum,
  Text,
} from '@wimet/apps-shared';
import styled from 'styled-components';
import { useField } from 'formik';
import useGetSpaceType from '../../../hooks/api/useGetSpaceType';
import useGetSpaceReservationType from '../../../hooks/api/useGetReservationType';
import useParsedSchedule from '../../../hooks/useParsedSchedule';

const StyledFormContainer = styled.div`
  display: grid;
  margin-top: 40px;
  gap: 40px;
  grid-template-columns: repeat(2, calc(50% - 20px));
`;

const StyledTitle = styled(Text)`
  color: ${({ theme }) => theme.colors.blue};
  font-weight: ${({ theme }) => theme.fontWeight[3]};
`;

const UploadMainInformation = () => {
  const [, , spaceReservationTypeHelpers] = useField('spaceReservationType');
  const [spaceReservationTypeId, , spaceReservationTypeIdHelpers] = useField('spaceReservationTypeId');
  const [spaceTypeId, , spaceTypeIdHelpers] = useField('spaceTypeId');
  const { handleOnChange } = useParsedSchedule();
  const initialSpaceTypeIdSet = useRef(false);

  const { data: spaceReservationTypes = [] } = useGetSpaceReservationType({
    select: types =>
      types.map(item => ({
        value: item.id,
        id: item.id,
        name: item.value,
        label: spaceReservationLabels[item.value as keyof typeof spaceReservationLabels],
      })),
  });

  const { data: spaceTypes } = useGetSpaceType(spaceReservationTypeId.value, {
    enabled: !!spaceReservationTypeId.value,
    select: types =>
      types.map(item => ({
        value: item.id,
        id: item.id,
        label: getSpaceTypeLabel(item.value as SpaceTypeEnum),
      })),
  });

  useEffect(
    () => {
      if (initialSpaceTypeIdSet.current) {
        spaceTypeIdHelpers.setValue(spaceTypes?.[0]?.value || '');
        return;
      }

      if (!spaceTypes) return;

      const selectedType = spaceTypes?.find(type => type.id === spaceTypeId.value)?.value;
      spaceTypeIdHelpers.setValue(selectedType || spaceTypes?.[0]?.value);
      initialSpaceTypeIdSet.current = true;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [spaceTypes]
  );

  const handleOnChangeReservationType = (newValue: unknown) => {
    const { name, value } = newValue as typeof spaceReservationTypes[number];
    spaceReservationTypeHelpers.setValue(name);
    spaceReservationTypeIdHelpers.setValue(value);
    handleOnChange();
  };

  return (
    <div>
      <StyledTitle>Datos del espacio</StyledTitle>
      <StyledFormContainer>
        <Select
          label='Tipo de reserva'
          options={spaceReservationTypes}
          onChange={handleOnChangeReservationType}
          instanceId='bookingOptions'
          name='spaceReservationTypeId'
        />
        <InputNumber label='Superficie' type='number' placeholder='50 mts2' name='area' />
        <Select label='Tipo de espacio' options={spaceTypes} instanceId='bookingOptions' name='spaceTypeId' />
        <InputNumber label='Capacidad' type='number' placeholder='15' name='peopleCapacity' />
      </StyledFormContainer>
    </div>
  );
};

export default UploadMainInformation;
