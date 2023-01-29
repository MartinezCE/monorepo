import { Input, Select } from '@wimet/apps-shared';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 40px;
`;

const SelectTermOptions = [
  { value: 1, label: '1 mes' },
  { value: 3, label: '3 meses' },
  { value: 6, label: '6 meses' },
  { value: 12, label: '12 meses' },
];

export default function LeftSideInputs() {
  return (
    <StyledWrapper>
      <Input label='Precio mensual' placeholder='$ 0' type='number' name='monthly.price' />
      <Select
        instanceId='minMonthsAmount'
        label='Mínimo*'
        options={SelectTermOptions}
        isSearchable={false}
        name='monthly.minMonthsAmount'
      />
      <Select
        instanceId='maxMonthsAmount'
        label='Máximo'
        options={SelectTermOptions}
        isSearchable={false}
        name='monthly.maxMonthsAmount'
      />
    </StyledWrapper>
  );
}
