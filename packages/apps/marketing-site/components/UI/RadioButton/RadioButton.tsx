import { FormEvent } from 'react';
import styled from 'styled-components';

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  align-items: center;
  color: ${({ theme }) => theme.colors.lightBlue};
  font-size: 1rem;
  font-weight: 500;
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
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.blue};
  position: relative;
  cursor: pointer;
  border-radius: 999px;

  &:after {
    content: '';
    display: none;
    position: absolute;
    left: 50%;
    top: 50%;
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background-color: ${({ theme }) => theme.colors.white};
    transform: translate(-50%, -50%);
  }

  &:checked {
    background-color: ${({ theme }) => theme.colors.blue};

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

type RadioButtonProps = {
  label?: string;
  name?: string;
  checked?: boolean;
  className?: string;
  onChange?: (checked: FormEvent<HTMLInputElement>) => void;
  onClick?: (checked: FormEvent<HTMLLabelElement>) => void;
};

export default function RadioButton({
  label,
  name,
  checked,
  className,
  onChange = () => {},
  onClick,
}: RadioButtonProps) {
  return (
    <StyledLabel className={className} onClick={onClick}>
      <StyledInput withLabel={!!label} checked={checked} onChange={onChange} type='radio' name={name} />
      <StyledText>{label}</StyledText>
    </StyledLabel>
  );
}
