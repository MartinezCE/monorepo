import { ChangeEvent, ComponentPropsWithoutRef, FocusEvent, HTMLInputTypeAttribute } from 'react';
import styled, { css } from 'styled-components';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 8px;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes[2]};
  font-weight: 500;
`;

type StyledInputProps = {
  variant?: 'default' | 'withText' | 'error' | 'success';
  withLeadingAdornment?: boolean;
  withTrailingAdornment?: boolean;
};

const StyledWrapperInput = styled.div<StyledInputProps>`
  flex-grow: 1;
  display: flex;
  border-radius: 4px;
  overflow: hidden;

  ${({ variant }) => {
    switch (variant) {
      case 'default':
        return css`
          border: 1px solid ${({ theme }) => theme.colors.gray};

          &:hover,
          &:focus-within {
            border: 1px solid ${({ theme }) => theme.colors.blue};
          }
        `;
      case 'withText':
        return css`
          border: 1px solid black;
        `;
      case 'error':
        return css`
          border: 1px solid ${({ theme }) => theme.colors.error};
        `;
      case 'success':
        return css`
          border: 1px solid ${({ theme }) => theme.colors.success};
        `;
      default:
        return '';
    }
  }}
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 15px 24px;
  font-size: ${({ theme }) => theme.fontSizes[2]};
  font-weight: 300;
  border: none;
  outline: none;
`;

type InputProps = ComponentPropsWithoutRef<'input'> & {
  label?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  value?: string | number | readonly string[];
  className?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  variant?: StyledInputProps['variant'];
  trailingAdornment?: JSX.Element;
  leadingAdornment?: JSX.Element;
};

export default function Input({
  label,
  placeholder,
  type = 'text',
  value,
  className,
  onChange,
  onFocus,
  onBlur,
  autoComplete = 'off',
  variant = 'default',
  trailingAdornment,
  leadingAdornment,
  ...props
}: InputProps) {
  return (
    <StyledWrapper className={className}>
      {label && <Label>{label}</Label>}
      <StyledWrapperInput variant={variant}>
        {leadingAdornment}
        <StyledInput
          id='input'
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          autoComplete={autoComplete}
          {...props}
        />
        {trailingAdornment}
      </StyledWrapperInput>
    </StyledWrapper>
  );
}
