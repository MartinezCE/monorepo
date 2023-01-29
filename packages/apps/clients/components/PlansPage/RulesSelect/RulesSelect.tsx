import { Select } from '@wimet/apps-shared';
import { useFormikContext } from 'formik';
import React from 'react';
import styled from 'styled-components';
import type { PLANS } from '../../../mocks';

export const planRules = [
  {
    label: 'No utilizar más de 10 créditos / día',
    value: 'noMoreThan10CreditsPerDay',
  },
  {
    label: 'Reservar solo escritorios',
    value: 'onlyUseDesks',
  },
  {
    label: 'Reservar solo oficinas',
    value: 'reserveOnlyOffices',
  },
];

const StyledSelect = styled(Select)`
  .react-select__control + div {
    max-height: 210px;
    overflow-y: auto;
  }
`;

const RulesSelect = () => {
  const formik = useFormikContext();
  return (
    <StyledSelect
      defaultValue={(formik.values as typeof PLANS[0]).planRulesId}
      name='planRulesId'
      label='Reglas del plan'
      instanceId='planRules'
      isMulti
      options={planRules}
      isCreatable
      isClearable={false}
      placeholder='Buscar por regla'
      noOptionsMessage={() => 'No hay mas reglas'}
      isDisabled
    />
  );
};

export default RulesSelect;
