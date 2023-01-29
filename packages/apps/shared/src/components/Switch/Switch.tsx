import { ChangeEvent } from 'react';
import styled from 'styled-components';

type StyledLabelProps = {
  disabled: boolean;
};
const StyledLabel = styled.label<StyledLabelProps>`
  font-size: ${({ theme }) => theme.fontSizes[2]};
  line-height: ${({ theme }) => theme.lineHeights[1]};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.blue};
  display: flex;
  align-items: center;
  column-gap: 16px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

const StyledWrapper = styled.div`
  position: relative;
  width: 50px;
  height: 26px;
`;

const StyledInput = styled.input`
  visibility: hidden;
  width: 0;
  height: 0;
`;

const StyledSwitch = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: 999px;
  display: flex;
  align-items: center;
  padding: 3px;
  transition: background-color 0.1s ease-in-out;

  &::after {
    content: '';
    width: auto;
    height: 100%;
    aspect-ratio: 1;
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 50%;
    transition: transform 0.1s ease-in-out;
  }

  ${StyledInput}:checked + & {
    background-color: ${({ theme }) => theme.colors.blue};

    &::after {
      transform: translateX(calc(100% + 3px));
    }
  }

  ${StyledInput}:checked:disabled + & {
    background-color: ${({ theme }) => theme.colors.lightBlue};
  }
`;

type Props = {
  label?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  checked?: boolean;
  className?: string;
};

export default function Switch({ label, onChange, checked, className, disabled }: Props) {
  return (
    <StyledLabel className={className} disabled={disabled}>
      <StyledWrapper>
        <StyledInput type='checkbox' defaultChecked={checked} onChange={onChange} disabled={disabled} />
        <StyledSwitch />
      </StyledWrapper>
      {label}
    </StyledLabel>
  );
}
