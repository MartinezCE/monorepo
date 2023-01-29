import { ComponentPropsWithoutRef, forwardRef, ReactNode, Ref } from 'react';
import styled from 'styled-components';
import { ButtonMixin, ButtonMixinProps } from '../../mixins';

const StyledButton = styled.button<ButtonMixinProps>`
  ${ButtonMixin}
`;

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  children?: ReactNode;
  leadingIcon?: JSX.Element;
  trailingIcon?: JSX.Element;
  className?: string;
  fullWidth?: boolean;
  noBackground?: boolean;
  noClickable?: boolean;
  variant?: ButtonMixinProps['variant'];
  disabled?: boolean;
  onClick?: () => void;
};

function Button(
  {
    children,
    leadingIcon,
    trailingIcon,
    className,
    fullWidth,
    noBackground,
    noClickable,
    variant = 'primary',
    onClick,
    disabled,
    ...props
  }: ButtonProps,
  ref: Ref<HTMLButtonElement> // eslint-disable-line @typescript-eslint/comma-dangle
) {
  return (
    <StyledButton
      onlyIcon={!children}
      className={className}
      fullWidth={fullWidth}
      noBackground={noBackground}
      noClickable={noClickable}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      ref={ref}
      {...props}>
      {leadingIcon}
      {children}
      {trailingIcon}
    </StyledButton>
  );
}

export default forwardRef<HTMLButtonElement, ButtonProps>(Button);
