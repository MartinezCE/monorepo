import { FormEvent } from 'react';
import styled from 'styled-components';

const StyledLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes[2]};
  line-height: ${({ theme }) => theme.lineHeights[1]};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.blue};
  display: flex;
  align-items: center;
  column-gap: 12px;
  cursor: pointer;
`;

const StyledText = styled.span`
  all: inherit;
`;

const StyledInput = styled.input<{ withLabel?: boolean }>`
  appearance: none;
  padding: 10px;
  margin: 0;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: inset 0 0 0 2px ${({ theme }) => theme.colors.blue};
  position: relative;
  cursor: pointer;
  border-radius: 999px;

  &:after {
    content: '';
    display: none;
    position: absolute;
    left: 50%;
    top: 50%;
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background-color: ${({ theme }) => theme.colors.blue};
    transform: translate(-50%, -50%);
  }

  &:checked {
    & + ${StyledText} {
      color: ${({ theme }) => theme.colors.blue};
    }

    &:after {
      display: block;
    }
  }

  &:focus {
    outline: none;
  }
`;

type Props = {
  label?: string;
  name?: string;
  checked?: boolean;
  className?: string;
  value?: string | number | readonly string[];
  onChange?: (checked: FormEvent<HTMLInputElement>) => void;
  onClick?: (checked: FormEvent<HTMLLabelElement>) => void;
};

export default function RadioButton({ label, name, checked, className, onChange = () => {}, onClick, value }: Props) {
  return (
    <StyledLabel className={className} onClick={onClick}>
      <StyledInput
        withLabel={!!label}
        defaultChecked={checked}
        onChange={onChange}
        type='radio'
        name={name}
        value={value}
      />
      <StyledText>{label}</StyledText>
    </StyledLabel>
  );
}
