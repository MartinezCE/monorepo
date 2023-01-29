import { RadioButton } from '@wimet/apps-shared';
import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  cursor: pointer;
  flex-grow: 1;
`;

const StyledRadioButton = styled(RadioButton)`
  margin-bottom: 44px;

  span {
    margin-bottom: 0;
    margin-left: 32px;
    font-weight: 200;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.darkGray};
  }

  & input:checked + span {
    color: ${({ theme }) => theme.colors.blue};
    font-weight: 500;
  }
`;

const FilterLocationOptionPage = () => (
  <StyledWrapper>
    <StyledRadioButton label='Buenos Aires' name='city' />
    <StyledRadioButton label='Ciudad de México' name='city' />
    <StyledRadioButton label='Santiago de Chile' name='city' />
  </StyledWrapper>
);

export default FilterLocationOptionPage;
