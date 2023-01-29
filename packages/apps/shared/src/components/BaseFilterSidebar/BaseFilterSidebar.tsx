import React from 'react';
import styled from 'styled-components';
import Button from '../Button';
import { images } from '../../assets';
import SidebarBase from '../Sidebar/SidebarBase';

const StyledWrapper = styled(SidebarBase)`
  position: fixed;
  height: 100vh;
  width: 540px;
  left: initial;
  right: 0;
  top: 0;
  padding: 128px 48px 48px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: -11px 0px 58px -16px rgba(0, 0, 0, 0.15);
  z-index: 3;
  overflow-y: auto;
`;

const StyledHeaderArea = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 48px;
`;

const StyledHeaderText = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StyledHeaderLeftArea = styled.div`
  display: flex;
  align-items: center;
`;

const StyledHeaderBackButton = styled(Button)`
  margin-right: 24px;
  padding: 4px;
`;

const StyledCloseIcon = styled(images.TinyClose)`
  transform: scale(1.955);
  & path {
    stroke-width: 1 !important;
  }
`;

const ChevronLeftIcon = images.ChevronLeft;

type Props = {
  title?: String;
  onClickClose: () => void;
  children: JSX.Element;
  onClickBack?: () => void;
  className?: string;
};

const BaseFilterSidebar = ({ title, children, onClickClose, onClickBack, className }: Props) => (
  <StyledWrapper className={className}>
    <StyledHeaderArea>
      <StyledHeaderLeftArea>
        {onClickBack && (
          <StyledHeaderBackButton variant='secondary' onClick={onClickBack}>
            <ChevronLeftIcon />
          </StyledHeaderBackButton>
        )}
        {title && <StyledHeaderText>{title}</StyledHeaderText>}
      </StyledHeaderLeftArea>

      <Button variant='transparent' onClick={onClickClose}>
        <StyledCloseIcon />
      </Button>
    </StyledHeaderArea>
    {children}
  </StyledWrapper>
);

export default BaseFilterSidebar;
