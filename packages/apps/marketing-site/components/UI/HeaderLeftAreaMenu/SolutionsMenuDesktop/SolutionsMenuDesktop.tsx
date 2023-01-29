import React from 'react';
import styled from 'styled-components';
import { Link } from '../../../../hooks/api/types';
import { SolutionTitle, StyledArrowIconWrapper, SubMenu } from '../SolutionsMenu/SolutionsMenu';

const StyledMenuContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) rotateX(-15deg);
  transform-origin: 50% 0;
  flex-direction: column;
  opacity: 0;
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
  pointer-events: none;
`;

const StyledWrapper = styled.div`
  position: relative;
  -webkit-perspective: 800px;
  perspective: 800px;

  &:hover ${StyledMenuContainer} {
    opacity: 100%;
    transform: translateX(-50%) rotateX(0deg);
    pointer-events: auto;
  }

  &:hover ${StyledArrowIconWrapper} {
    transform: rotate(180deg);
  }
`;

type StyledMenuContentProps = {
  isOnTop?: boolean;
};

const StyledMenuContent = styled.ul<StyledMenuContentProps>`
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  min-width: 100%;
  flex-wrap: nowrap;
  padding: 48px;
  margin-top: calc(28px + ${({ isOnTop }) => (!isOnTop ? '-12px' : '16px')});
  transition: margin-top 0.3s ease-in-out;
`;

type SolutionsMenuProps = {
  isOnTop?: boolean;
  title: string;
  links: Link[];
};

const SolutionsMenuDesktop: React.FC<SolutionsMenuProps> = ({ isOnTop = false, title, links }) => (
  <StyledWrapper>
    <SolutionTitle title={title} />
    <StyledMenuContainer>
      <StyledMenuContent isOnTop={isOnTop}>
        <SubMenu links={links} />
      </StyledMenuContent>
    </StyledMenuContainer>
  </StyledWrapper>
);

export default SolutionsMenuDesktop;
