import { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { mixins } from '../../common';
import { LayoutVariant } from '../../types';

type StyledWrapperProps = {
  isLogged: boolean;
  isFixed: boolean;
  noAbsolute: boolean;
  variant?: LayoutVariant;
};

const StyledWrapper = styled.div<StyledWrapperProps>`
  ${mixins.ShadowBox};
  width: 100%;
  height: ${({ theme }) => theme.heights.header};
  border-radius: ${({ isLogged }) => (isLogged ? '0px 0px 3px 3px' : '0px 0px 8px 8px')};

  position: ${({ isFixed, noAbsolute }) => {
    if (isFixed) return 'fixed';
    if (noAbsolute) return 'relative';
    return 'absolute';
  }};
  top: 0;
  left: 0;
  z-index: 9;

  ${({ isLogged, theme, variant }) => {
    let borderColor = theme.colors.orange;
    switch (variant) {
      case 'orange':
        borderColor = theme.colors.orange;
        break;
      case 'blue':
        borderColor = theme.colors.blue;
        break;
      case 'sky':
        borderColor = theme.colors.sky;
        break;
      default:
        borderColor = theme.colors.orange;
        break;
    }
    return css`
      border-bottom: ${isLogged ? `2px solid ${borderColor}` : '0'};
    `;
  }};
`;

const StyledContainer = styled.div`
  ${mixins.Layout}
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

type Props = {
  isLogged?: boolean;
  isFixed?: boolean;
  noAbsolute?: boolean;
  children?: ReactNode;
  className?: string;
  variant?: LayoutVariant;
};

const BaseHeader = ({ isLogged, isFixed = true, noAbsolute, children, className, variant }: Props) => (
  <StyledWrapper
    id='BaseHeaderApp'
    isLogged={isLogged}
    isFixed={isFixed}
    noAbsolute={noAbsolute}
    variant={variant}
    className={className}>
    <StyledContainer>{children}</StyledContainer>
  </StyledWrapper>
);

export default BaseHeader;
