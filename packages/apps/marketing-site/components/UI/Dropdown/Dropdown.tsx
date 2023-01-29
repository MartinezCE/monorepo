import { ReactNode } from 'react';
import styled from 'styled-components';

const StyledDropdown = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  padding: 8px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 20px 40px -12px ${({ theme }) => theme.colors.gray}26;
  z-index: 2;
  background-color: ${({ theme }) => theme.colors.white};
`;

type DropdownProps = {
  children?: ReactNode;
  className?: string;
};

export default function Dropdown({ children, className }: DropdownProps) {
  return <StyledDropdown className={className}>{children}</StyledDropdown>;
}
