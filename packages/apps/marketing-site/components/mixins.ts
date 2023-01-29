import { css } from 'styled-components';

export const Layout = css`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 104px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 24px;
  }
`;

export const ShadowBox = css`
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0px 20px 46px -20px rgba(44, 48, 56, 0.15);
`;

export type ButtonMixinProps = {
  onlyIcon?: boolean;
  fullWidth?: boolean;
  noBackground?: boolean;
  noClickable?: boolean;
  variant: 'primary' | 'secondary' | 'tertiary' | 'fourth' | 'fifth' | 'outline' | 'input';
};

export const ButtonMixin = ({ onlyIcon, fullWidth, variant, noBackground, noClickable }: ButtonMixinProps) => css`
  font-size: ${({ theme }) => theme.fontSizes[2]};
  line-height: ${({ theme }) => theme.lineHeights[1]};
  padding: 12px 26px;
  border: none;
  font-weight: 500;
  border-radius: 4px;
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  justify-content: space-between;
  column-gap: 11px;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out;

  ${onlyIcon &&
  css`
    padding: 14px;
  `}

  ${fullWidth &&
  css`
    width: 100%;
  `}

  ${() => {
    switch (variant) {
      case 'primary':
        return css`
          color: ${({ theme }) => theme.colors.white};
          background-color: ${({ theme }) => theme.colors.blue};

          &:hover,
          &:focus {
            color: ${({ theme }) => theme.colors.blue};
            background-color: ${({ theme }) => theme.colors.extraLightBlue};
          }
        `;
      case 'secondary':
        return css`
          color: ${({ theme }) => theme.colors.blue};
          background-color: ${({ theme }) => theme.colors.extraLightBlue};

          &:hover,
          &:focus {
            background-color: ${({ theme }) => theme.colors.lightBlue};
          }
        `;
      case 'tertiary':
        return css`
          color: ${({ theme }) => theme.colors.orange};
          background-color: ${({ theme }) => theme.colors.extraLightOrange};

          &:hover,
          &:focus {
            background-color: ${({ theme }) => theme.colors.lightOrange};
          }
        `;
      case 'fourth':
        return css`
          color: ${({ theme }) => theme.colors.blue};
          background-color: ${({ theme }) => theme.colors.white};

          &:hover,
          &:focus {
            color: ${({ theme }) => theme.colors.darkBlue};
            background-color: ${({ theme }) => theme.colors.extraLightBlue};
          }
        `;
      case 'fifth':
        return css`
          color: ${({ theme }) => theme.colors.white};
          background-color: ${({ theme }) => theme.colors.blue};

          &:hover,
          &:focus {
            background-color: ${({ theme }) => theme.colors.darkBlue};
          }
        `;
      case 'outline':
        return css`
          background-color: ${({ theme }) => theme.colors.white};
          border: 1px solid ${({ theme }) => theme.colors.blue};
          color: ${({ theme }) => theme.colors.blue};

          &:hover,
          &:focus {
            background-color: ${({ theme }) => theme.colors.extraLightBlue};
          }
        `;
      case 'input':
        return css`
          background-color: initial;
          border-radius: 999px;

          &:hover,
          &:focus {
            background-color: ${({ theme }) => theme.colors.lightGray};
          }

          &:active {
            background-color: ${({ theme }) => theme.colors.gray};
          }
        `;
      default:
        return '';
    }
  }}

  ${noBackground &&
  css`
    padding: 0;
    border: none;
    background-color: initial;

    &:hover,
    &:focus {
      background-color: initial;
    }
  `}

  ${noClickable &&
  css`
    cursor: default;
  `}

  &:disabled,
  &:disabled:hover,
  &:disabled:focus {
    background-color: ${({ theme }) => theme.colors.lightGray};
    border-color: transparent;
    cursor: default;
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.gray};

    ${onlyIcon &&
    css`
      color: ${({ theme }) => theme.colors.gray};
      background-color: ${({ theme }) => theme.colors.lightGray};
    `}
  }
`;
