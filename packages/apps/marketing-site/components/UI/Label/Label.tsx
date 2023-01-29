import styled, { css } from 'styled-components';

type StyledLabelProps = {
  size?: 'small' | 'large';
  variant: 'primary' | 'secondary';
};

const StyledLabel = styled.span<StyledLabelProps>`
  font-size: ${({ theme }) => theme.fontSizes[0]};
  font-weight: 500;
  text-transform: uppercase;
  line-height: ${({ theme }) => theme.lineHeights[0]};

  ${({ size }) =>
    size === 'large' &&
    css`
      font-size: ${({ theme }) => theme.fontSizes[2]};
      line-height: ${({ theme }) => theme.lineHeights[1]};
    `}

  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return css`
          color: ${({ theme }) => theme.colors.orange};
        `;
      case 'secondary':
        return css`
          color: ${({ theme }) => theme.colors.gray};
        `;
      default:
        return '';
    }
  }}
`;

type LabelProps = {
  text?: string;
  size?: 'small' | 'large';
  variant?: StyledLabelProps['variant'];
  className?: string;
};

export default function Label({ text = '', size = 'small', variant = 'primary', className }: LabelProps) {
  return (
    <StyledLabel size={size} variant={variant} className={className}>
      {text}
    </StyledLabel>
  );
}
