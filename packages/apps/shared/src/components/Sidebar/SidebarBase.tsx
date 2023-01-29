import { ComponentPropsWithoutRef, ReactNode } from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.aside`
  flex-shrink: 0;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.blue};
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
`;

type Props = ComponentPropsWithoutRef<'div'> & {
  children?: ReactNode;
};

export default function SidebarBase({ children, ...props }: Props) {
  return <StyledWrapper {...props}>{children}</StyledWrapper>;
}
