import { Blueprint, ClientLocation, Floor, Select } from '@wimet/apps-shared';
import { FormikProvider, useFormik } from 'formik';
import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  margin-top: 44px;
  display: grid;
  column-gap: 24px;
  grid-template-columns: repeat(3, 1fr);
`;

type SelectOption = { label: string; value: number };

type Props = {
  locationOptions: SelectOption[];
  floorOptions: SelectOption[];
  blueprintOptions: SelectOption[];
  currentLocation?: Partial<ClientLocation>;
  currentFloor?: Floor;
  currentBlueprint: Blueprint;
  handleFilters: (e: { value: string }, name: string) => void;
};

const ReservesForm = ({
  locationOptions,
  floorOptions,
  blueprintOptions,
  currentLocation,
  currentFloor,
  currentBlueprint,
  handleFilters,
}: Props) => {
  const formik = useFormik({ initialValues: {}, onSubmit: () => {} });

  return (
    <FormikProvider value={formik}>
      <StyledWrapper>
        <Select
          name='locationId'
          label='Locación'
          instanceId='locations'
          options={locationOptions}
          value={currentLocation || null}
          onChange={e => handleFilters(e as { value: string }, 'locationId')}
          placeholder='Contract Workplaces Honduras'
        />
        <Select
          name='floorId'
          label='Piso'
          instanceId='floors'
          options={floorOptions}
          value={currentFloor || null}
          onChange={e => handleFilters(e as { value: string }, 'floorId')}
          placeholder='Piso 4'
        />
        <Select
          name='blueprintId'
          label='Nombre del plano'
          instanceId='blueprints'
          options={blueprintOptions}
          value={currentBlueprint || null}
          onChange={e => handleFilters(e as { value: string }, 'blueprintId')}
          placeholder='Área Azul'
        />
      </StyledWrapper>
    </FormikProvider>
  );
};

export default ReservesForm;
