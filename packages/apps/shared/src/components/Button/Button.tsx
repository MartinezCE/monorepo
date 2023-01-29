import { ComponentPropsWithoutRef, forwardRef, ReactNode, Ref } from 'react';
import styled from 'styled-components';
import { ButtonMixin, ButtonMixinProps } from '../../common/mixins';

const StyledButton = styled.button<ButtonMixinProps>`
  ${ButtonMixin}
`;

type Props = ComponentPropsWithoutRef<'button'> & {
  children?: ReactNode;
  leadingIcon?: JSX.Element;
  trailingIcon?: JSX.Element;
  fullWidth?: boolean;
  noBackground?: boolean;
  noClickable?: boolean;
  variant?: ButtonMixinProps['variant'];
};

function Button(
  { children, leadingIcon, trailingIcon, fullWidth, noBackground, noClickable, variant = 'primary', ...props }: Props,
  ref: Ref<HTMLButtonElement>
) {
  return (
    <StyledButton
      onlyIcon={!children}
      hasIcons={!!leadingIcon || !!trailingIcon}
      variant={variant}
      noClickable={noClickable}
      noBackground={noBackground}
      fullWidth={fullWidth}
      ref={ref}
      type='button'
      {...props}>
      {leadingIcon}
      {children}
      {trailingIcon}
    </StyledButton>
  );
}

export default forwardRef<HTMLButtonElement, Props>(Button);
