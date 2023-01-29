import { ReactNode } from 'react';
import styled from 'styled-components';
import { AuthHeader, LayoutBase } from '@wimet/apps-shared';
import Sidebar from '../Sidebar';

const StyledLayoutBase = styled(LayoutBase)`
  padding-left: 493px !important; // TODO: Remove '!important' when mobile UI is ready
`;

const StyledWrapperContent = styled.div`
  width: 100%;
  min-height: 100vh;
  padding-top: ${({ theme }) => theme.heights.header};
`;

type Props = {
  children?: ReactNode;
  title?: string;
  sidebarTitle?: string;
  sidebarDescription?: string;
};

export default function Layout({ children, title, sidebarTitle, sidebarDescription }: Props) {
  return (
    <StyledLayoutBase title={title} customHeader={<AuthHeader logoHref={process.env.NEXT_PUBLIC_INDEX_URL} />}>
      <Sidebar title={sidebarTitle} description={sidebarDescription} />
      <StyledWrapperContent>{children}</StyledWrapperContent>
    </StyledLayoutBase>
  );
}
