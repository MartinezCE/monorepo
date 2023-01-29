import { ReactNode } from 'react';
import styled, { css } from 'styled-components';

type StyledErrorTextProps = {
  position?: 'absolute' | 'relative';
};

const StyledErrorText = styled.span<StyledErrorTextProps>`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes[0]};
  line-height: ${({ theme }) => theme.lineHeights[0]};
  font-weight: ${({ theme }) => theme.fontWeight[0]};

  ${({ position }) =>
    position === 'absolute' &&
    css`
      position: absolute;
      left: 0;
      top: calc(100% + 8px);
    `}
`;

type Props = {
  children?: ReactNode;
  className?: string;
  position?: StyledErrorTextProps['position'];
};

export default function ErrorText({ children, className, position = 'relative' }: Props) {
  return (
    <StyledErrorText className={className} position={position}>
      {children}
    </StyledErrorText>
  );
}
