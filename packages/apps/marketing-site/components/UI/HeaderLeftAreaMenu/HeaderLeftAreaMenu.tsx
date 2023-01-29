import React from 'react';
import styled from 'styled-components';
import { HeaderApiResponse } from '../../../hooks/api/useGetHeader';
import { StyledMenuLink } from './commonStyle';
import SolutionsMenuDesktop from './SolutionsMenuDesktop';

const StyledMenu = styled.ul`
  display: flex;
  padding: 0;
  margin: 0;
  margin-left: 48px;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    margin-left: 28px;
  }
`;

const StyledMenuItem = styled.li`
  list-style: none;
  margin-right: 48px;
  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    margin-right: 20px;
  }
`;

type Props = {
  data: HeaderApiResponse;
  isOnTop?: boolean;
};

const HeaderLeftAreaMenu = ({ data, isOnTop }: Props) => (
  <StyledMenu>
    <StyledMenuItem>
      <StyledMenuLink href={data?.attributes?.whyWimet.url}>{data?.attributes?.whyWimet.name}</StyledMenuLink>
    </StyledMenuItem>
    <SolutionsMenuDesktop
      isOnTop={isOnTop}
      title={data?.attributes?.solutionMenu.name || ''}
      links={data?.attributes?.solutionMenu.links || []}
    />
  </StyledMenu>
);

export default HeaderLeftAreaMenu;
