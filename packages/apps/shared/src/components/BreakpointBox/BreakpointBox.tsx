import { CSSProperties, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../common';

type Breakpoint = keyof typeof theme.breakpoints;
type Breakpoints = {
  [key in Breakpoint]?: CSSProperties['display'];
};

type StyledWrapperProps = {
  breakpoints: Breakpoints;
  initialDisplay?: CSSProperties['display'];
};

const StyledWrapper = styled.div<StyledWrapperProps>`
  ${({ initialDisplay, breakpoints }) =>
    css`
      display: ${initialDisplay};

      ${(Object.keys(breakpoints) as Array<keyof Breakpoints>)
        .map(
          breakpoint => `
            @media screen and (max-width: ${theme.breakpoints[breakpoint]}) {
              display: ${breakpoints[breakpoint] || 'none'};
            }
          `
        )
        .join('')}
    `}
`;

type BreakpointBoxProps = {
  initialDisplay?: CSSProperties['display'];
  breakpoints: Breakpoints;
  children: ReactNode;
  className?: string;
};

export default function BreakpointBox({
  initialDisplay = 'none',
  breakpoints,
  children,
  className,
}: BreakpointBoxProps) {
  return (
    <StyledWrapper className={className} initialDisplay={initialDisplay} breakpoints={breakpoints}>
      {children}
    </StyledWrapper>
  );
}
