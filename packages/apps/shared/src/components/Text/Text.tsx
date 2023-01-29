import { ReactNode } from 'react';
import styled from 'styled-components';

type StyledTextprops = {
  variant: 'large' | 'small';
};

const StyledText = styled.p<StyledTextprops>`
  font-size: ${({ variant, theme }) => (variant === 'large' ? theme.fontSizes[4] : theme.fontSizes[2])};
  line-height: ${({ variant, theme }) => (variant === 'large' ? theme.lineHeights[2] : theme.lineHeights[1])};
`;

type Props = {
  children: ReactNode;
  variant?: 'large' | 'small';
  className?: string;
};

export default function Text({ children, variant = 'small', className }: Props) {
  return (
    <StyledText className={className} variant={variant}>
      {children}
    </StyledText>
  );
}
