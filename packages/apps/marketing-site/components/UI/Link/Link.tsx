import { ComponentPropsWithoutRef, forwardRef, ReactNode, Ref } from 'react';
import styled from 'styled-components';
import { ButtonMixin, ButtonMixinProps } from '../../mixins';

const StyledLink = styled.a<ButtonMixinProps>`
  ${ButtonMixin}
  text-decoration: none;
  cursor: pointer;
  text-align: center;
  user-select: none;
`;

type LinkProps = ComponentPropsWithoutRef<'a'> & {
  children?: ReactNode;
  leadingIcon?: JSX.Element;
  trailingIcon?: JSX.Element;
  className?: string;
  fullWidth?: boolean;
  noBackground?: boolean;
  noClickable?: boolean;
  variant?: ButtonMixinProps['variant'];
};

function Link(
  {
    children,
    leadingIcon,
    trailingIcon,
    className,
    fullWidth,
    noBackground,
    noClickable,
    variant = 'primary',
    href = '#',
    ...props
  }: LinkProps,
  ref: Ref<HTMLAnchorElement> // eslint-disable-line @typescript-eslint/comma-dangle
) {
  return (
    <StyledLink className={className} noClickable={noClickable} variant={variant} href={href} ref={ref} {...props}>
      {leadingIcon}
      {children}
      {trailingIcon}
    </StyledLink>
  );
}

export default forwardRef<HTMLAnchorElement, LinkProps>(Link);
