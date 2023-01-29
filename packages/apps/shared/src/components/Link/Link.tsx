import NextLink from 'next/link';
import { ComponentPropsWithoutRef, forwardRef, ReactNode, Ref } from 'react';
import styled from 'styled-components';
import { ButtonMixin, ButtonMixinProps } from '../../common/mixins';

const StyledLink = styled.a<ButtonMixinProps>`
  ${ButtonMixin}
  text-decoration: none;
  cursor: pointer;
  text-align: center;
  user-select: none;
`;

type Props = ComponentPropsWithoutRef<'a'> & {
  children?: ReactNode;
  leadingIcon?: JSX.Element;
  trailingIcon?: JSX.Element;
  className?: string;
  fullWidth?: boolean;
  noBackground?: boolean;
  noClickable?: boolean;
  variant?: ButtonMixinProps['variant'];
  disabled?: boolean;
  href?: string;
  shallow?: boolean;
  prefetch?: boolean;
};

function Link(
  {
    children,
    leadingIcon,
    trailingIcon,
    className,
    variant = 'primary',
    href = '',
    disabled,
    shallow,
    ...props
  }: Props,
  ref: Ref<HTMLAnchorElement>
) {
  return (
    <NextLink href={href} passHref shallow={shallow}>
      <StyledLink disabled={disabled} onlyIcon={!children} className={className} variant={variant} ref={ref} {...props}>
        {leadingIcon}
        {children}
        {trailingIcon}
      </StyledLink>
    </NextLink>
  );
}

export default forwardRef<HTMLAnchorElement, Props>(Link);
