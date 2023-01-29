import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div<{ isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ isOpen }) =>
    isOpen &&
    `
    span {
      &:first-child {
        transform: translateY(6px) rotate(45deg);
      }
      &:nth-child(2) {
        opacity: 0;
      }
      &:last-child {
        transform: translateY(-6px) rotate(-45deg);
      }
    }
  `};
`;

const StyledLine = styled.span`
  width: 16px;
  height: 1px;
  background: ${({ theme }) => theme.colors.blue};
  transition: 0.2s ease-in-out;
  &:not(:last-child) {
    margin-bottom: 5px;
  }
`;

type HamburgerProps = {
  isOpen?: boolean;
  handleClick?: () => void;
};

const Hamburger: React.FC<HamburgerProps> = ({ isOpen = true, handleClick }) => (
  <StyledWrapper isOpen={isOpen} onClick={handleClick}>
    <StyledLine />
    <StyledLine />
    <StyledLine />
  </StyledWrapper>
);

export default Hamburger;
