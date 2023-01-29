import styled, { css } from 'styled-components';

export const SpaceDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr repeat(2, auto) 1px repeat(2, auto);
  column-gap: 40px;
`;

export const SpaceDetailsGridCol = styled.div`
  display: grid;
  grid-auto-rows: 1fr;
  row-gap: 28px;
`;

export const SpaceDetailsGridSeparator = styled.div`
  height: 100%;
  width: 1px;
  background-color: ${({ theme }) => theme.colors.gray};
`;

type StyledRowProps = {
  variant?: 'disabled' | 'active' | 'hidden';
};

export const SpaceDetailsGridRow = styled.div<StyledRowProps>`
  color: ${({ theme }) => theme.colors.darkGray};
  font-weight: ${({ theme }) => theme.fontWeight[0]};
  font-size: ${({ theme }) => theme.fontSizes[4]};
  line-height: ${({ theme }) => theme.lineHeights[2]};
  &:first-letter {
    text-transform: uppercase;
  }
  ${({ variant }) => {
    if (variant === 'disabled')
      return css`
        color: ${({ theme }) => theme.colors.gray};
      `;
    if (variant === 'active')
      return css`
        color: ${({ theme }) => theme.colors.orange};
        font-weight: ${({ theme }) => theme.fontWeight[2]};
      `;
    if (variant === 'hidden')
      return css`
        color: transparent;
      `;
    return '';
  }}
`;

export const SpaceDetailsGridHeaderRow = styled(SpaceDetailsGridRow)`
  color: ${({ theme }) => theme.colors.darkBlue};
`;
