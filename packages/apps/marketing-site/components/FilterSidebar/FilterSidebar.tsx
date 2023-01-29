import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, BaseFilterSidebar } from '@wimet/apps-shared';
import FilterPageOption from './FilterPageOption';
import FilterInputNumber from './FilterInputNumber';
import FilterLocationOptionPage from './FilterLocationOptionPage';
import FilterSwitch from './FilterSwitch';
import FilterAmenitiesOptionPage from './FilterAmenitiesOptionPage';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100% - 92px);
`;
const StyledOptionsWrapper = styled.div`
  min-height: 100%;
`;

const StyledDivider = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.extraLightBlue};
  margin-bottom: 32px;
`;

const StyledActionsWrapper = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
`;

const StyledCleanFilterButton = styled(Button)`
  margin-top: 24px;
  color: ${({ theme }) => theme.colors.blue};
  font-weight: 500;
`;

const OPTIONS = {
  0: '',
  1: 'Ubicación',
  2: 'Amenties',
};

const SUBTITLE = 'Elige según tu necesidad';

type Props = {
  onClose: () => void;
};

const FilterSidebar = ({ onClose }: Props) => {
  const [pageOptionSelected, setPageOptionSelected] = useState(OPTIONS[0]);

  const handleApplyFilters = () => {
    if (pageOptionSelected !== OPTIONS[0]) {
      setPageOptionSelected(OPTIONS[0]);
      return;
    }
    onClose();
  };

  return (
    <BaseFilterSidebar
      title={pageOptionSelected || 'Filtros'}
      onClickClose={onClose}
      onClickBack={pageOptionSelected ? () => setPageOptionSelected(OPTIONS[0]) : undefined}>
      <StyledWrapper>
        {!pageOptionSelected && (
          <StyledOptionsWrapper>
            <FilterPageOption
              title={OPTIONS[1]}
              subtitle={SUBTITLE}
              onClick={() => setPageOptionSelected(OPTIONS[1])}
            />
            <StyledDivider />
            <FilterInputNumber title='Empleados' />
            <StyledDivider />
            <FilterPageOption
              title={OPTIONS[2]}
              subtitle={SUBTITLE}
              onClick={() => setPageOptionSelected(OPTIONS[2])}
            />
            <StyledDivider />
            <FilterInputNumber title='Créditos' suffixText='(máximo por reserva)' />
            <FilterSwitch title='Mostrar solo favoritos' onChange={() => {}} />
          </StyledOptionsWrapper>
        )}
        {pageOptionSelected === OPTIONS[1] && <FilterLocationOptionPage />}
        {pageOptionSelected === OPTIONS[2] && <FilterAmenitiesOptionPage />}
        <StyledActionsWrapper>
          <Button variant='primary' onClick={handleApplyFilters}>
            {pageOptionSelected === OPTIONS[0] ? 'Mostrar resultados' : 'Aplicar'}
          </Button>
          <StyledCleanFilterButton variant='transparent'>Limpiar filtros</StyledCleanFilterButton>
        </StyledActionsWrapper>
      </StyledWrapper>
    </BaseFilterSidebar>
  );
};

export default FilterSidebar;
