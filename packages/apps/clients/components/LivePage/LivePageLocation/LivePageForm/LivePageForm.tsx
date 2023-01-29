import { Select } from '@wimet/apps-shared';
import React from 'react';
import styled from 'styled-components';
import useFilterOptions from '../../../WorkplaceManagerPage/SelectSeatsSection/useFilterOptions';

const StyledWrapper = styled.div`
  display: grid;
  column-gap: 24px;
  grid-template-columns: repeat(3, 1fr);
`;

const LivePageForm = ({
  locationOptions,
  currentLocation,
  floorOptions,
  blueprintOptions,
  currentFloor,
  currentBlueprint,
  handleFilters,
}: ReturnType<typeof useFilterOptions>) => (
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
);

export default LivePageForm;
