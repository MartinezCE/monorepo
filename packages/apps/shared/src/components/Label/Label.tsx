import styled, { css } from 'styled-components';

type StyledLabelProps = {
  size?: 'small' | 'large' | 'xlarge';
  variant: 'primary' | 'secondary' | 'tertiary' | 'currentColor';
  lowercase?: boolean;
};

const StyledLabel = styled.span<StyledLabelProps>`
  font-weight: 500;

  ${({ lowercase }) =>
    !lowercase &&
    css`
      text-transform: uppercase;
    `}

  ${({ size }) => {
    switch (size) {
      case 'small':
        return css`
          font-size: ${({ theme }) => theme.fontSizes[0]};
          line-height: ${({ theme }) => theme.lineHeights[0]};
        `;
      case 'large':
        return css`
          font-size: ${({ theme }) => theme.fontSizes[2]};
          line-height: ${({ theme }) => theme.lineHeights[1]};
        `;
      case 'xlarge':
        return css`
          font-size: ${({ theme }) => theme.fontSizes[4]};
          line-height: ${({ theme }) => theme.lineHeights[1]};
        `;
      default:
        return '';
    }
  }}

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
      case 'tertiary':
        return css`
          color: ${({ theme }) => theme.colors.blue};
        `;
      case 'currentColor':
        return css`
          color: inherit;
        `;
      default:
        return '';
    }
  }}
`;

type Props = {
  text?: string;
  prefix?: string;
  size?: StyledLabelProps['size'];
  variant?: StyledLabelProps['variant'];
  className?: string;
  lowercase?: boolean;
};

// TODO: Replace this `prefix` and `text` with children
export default function Label({ prefix, text = '', size = 'small', variant = 'primary', className, lowercase }: Props) {
  return (
    <StyledLabel size={size} variant={variant} className={className} lowercase={lowercase}>
      {prefix && <strong>{prefix}</strong>} {text}
    </StyledLabel>
  );
}
