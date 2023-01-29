import React, { ComponentPropsWithoutRef } from 'react';
import styled from 'styled-components';
import { Check } from '../../assets/images';

const StyledWrapper = styled.div`
  width: 22px;
  height: 22px;
  border: 2px solid ${({ theme }) => theme.colors.darkBlue};
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.darkBlue};
  background: ${({ theme }) => theme.colors.whiteOpacity80};
  position: relative;
`;

const StyledCheckbox = styled(Check)`
  width: 16px;
  height: 14px;
  opacity: 0;
  transition: opacity 0.1s linear;
`;

const StyledInputCheckbox = styled.input`
  cursor: pointer;
  height: 100%;
  left: 0;
  margin: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 2;
  &:checked + ${StyledCheckbox} {
    opacity: 1;
  }
`;

type CheckboxProps = ComponentPropsWithoutRef<'input'>;

const Checkbox: React.FC<CheckboxProps> = ({ className, ...props }) => (
  <StyledWrapper className={className}>
    <StyledInputCheckbox type='checkbox' {...props} />
    <StyledCheckbox />
  </StyledWrapper>
);

export default Checkbox;
