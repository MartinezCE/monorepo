import React from 'react';
import { Tag } from '@wimet/apps-shared';
import styled, { css, DefaultTheme, FlattenInterpolation, ThemeProps } from 'styled-components';

type TagProps = {
  type?: string;
};

const tagStylesConfig: { [key: string]: FlattenInterpolation<ThemeProps<DefaultTheme>> } = {
  Starter: css`
    background-color: ${({ theme }) => theme.colors.extraLightBlue};
    font-size: 12px;
    color: ${({ theme }) => theme.colors.darkGray};
    font-weight: 200;
  `,
  Team: css`
    background-color: ${({ theme }) => theme.colors.sky};
    font-size: 12px;
    color: ${({ theme }) => theme.colors.darkGray};
    font-weight: 200;
  `,
  Enterprise: css`
    background-color: ${({ theme }) => theme.colors.orange};
    font-size: 12px;
    color: ${({ theme }) => theme.colors.white};
    font-weight: 200;
  `,
  PayAsYouGo: css`
    height: initial;
    padding: 10px 18px;
    background-color: ${({ theme }) => theme.colors.extraLightGray};
    font-size: 20px;
    color: ${({ theme }) => theme.colors.blue};
    font-weight: 500;
    border-radius: 8px;
  `,
};

const StyledTag = styled(Tag)<TagProps>`
  ${({ type }) => tagStylesConfig[type || 'PayAsYouGo']}
`;

type Props = TagProps & {
  className?: string;
  children?: React.ReactNode;
};

const PlanTag = ({ type, className, children = type }: Props) => (
  <StyledTag className={className} type={type}>
    {children}
  </StyledTag>
);

export default PlanTag;
