import { useField } from 'formik';
import { ComponentPropsWithoutRef, forwardRef, Ref } from 'react';
import styled, { css } from 'styled-components';
import { getError } from '../../utils';
import Collapsible from '../Collapsible';
import ErrorText from '../ErrorText';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 8px;
  position: relative;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes[2]};
  font-weight: 500;
`;

type StyledWrapperInputProps = {
  variant?: 'default' | 'withText' | 'error' | 'success' | 'transparent';
  withLeadingAdornment?: boolean;
  withTrailingAdornment?: boolean;
  withValue?: boolean;
};

const StyledWrapperInput = styled.div<StyledWrapperInputProps>`
  flex-grow: 1;
  display: flex;
  border-radius: 4px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.white};
  max-height: 50px;

  ${({ variant, withValue }) => {
    switch (variant) {
      case 'default':
        return css`
          border: 1px solid ${({ theme }) => (withValue ? theme.colors.darkGray : theme.colors.gray)};

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
      case 'transparent':
        return css`
          border: none;
        `;
      default:
        return '';
    }
  }}
`;

const StyledInput = styled.input<StyledWrapperInputProps>`
  width: 100%;
  font-size: ${({ theme }) => theme.fontSizes[2]};
  border: none;
  outline: none;
  &[type='number'] {
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;
  }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }

  &:focus::placeholder {
    opacity: 0;
  }
  ${({ variant }) => {
    switch (variant) {
      case 'transparent':
        return css`
          font-weight: 600;
          margin-bottom: 5px;
        `;
      default:
        return css`
          font-weight: 300;
          padding: 15px 24px;
        `;
    }
  }}
`;

type Props = ComponentPropsWithoutRef<'input'> & {
  label?: string;
  className?: string;
  trailingAdornment?: JSX.Element;
  leadingAdornment?: JSX.Element;
  variant?: StyledWrapperInputProps['variant'];
  as?: 'input' | 'textarea';
  moveSiblingOnError?: boolean;
};

function Input(
  { label, className, trailingAdornment, leadingAdornment, variant = 'default', moveSiblingOnError, ...props }: Props,
  ref: Ref<HTMLInputElement>
) {
  const [field, meta] = useField(props?.name);
  const error = meta.touched ? getError(meta.error) : undefined;

  return (
    <StyledWrapper className={className}>
      {label && <Label>{label}</Label>}
      <StyledWrapperInput variant={!error ? variant : 'error'} withValue={!!field.value}>
        {leadingAdornment && leadingAdornment}
        <StyledInput variant={variant} ref={ref} autoComplete={props.autoComplete || 'off'} {...field} {...props} />
        {trailingAdornment && trailingAdornment}
      </StyledWrapperInput>
      {moveSiblingOnError ? (
        <Collapsible isOpen={!!error} deps={[error]}>
          <ErrorText>{error}</ErrorText>
        </Collapsible>
      ) : (
        <ErrorText position='absolute'>{error}</ErrorText>
      )}
    </StyledWrapper>
  );
}

export default forwardRef<HTMLInputElement, Props>(Input);
