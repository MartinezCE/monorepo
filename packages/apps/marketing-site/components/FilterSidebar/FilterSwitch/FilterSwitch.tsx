import { Switch } from '@wimet/apps-shared';
import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 72px;
`;

const StyledSwitchText = styled.div`
  margin-left: 16px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.darkGray};
  font-weight: 200;
`;

type Props = {
  title: string;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
};

const FilterSwitch = ({ title, onChange }: Props) => (
  <StyledWrapper>
    <Switch onChange={onChange} />
    <StyledSwitchText>{title}</StyledSwitchText>
  </StyledWrapper>
);

export default FilterSwitch;
