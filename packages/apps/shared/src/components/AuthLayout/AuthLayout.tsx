import { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import AuthSidebar, { SidebarLink } from '../AuthSidebar';
import LayoutBase from '../Layout';
import AuthHeader from '../AuthHeader';
import { LayoutVariant } from '../../types';

type StyledLayoutBaseProps = {
  isCollapsed?: boolean | null;
};

const StyledLayoutCollapsed = css`
  padding-left: 80px;
`;

const StyledLayoutBase = styled(LayoutBase)<StyledLayoutBaseProps>`
  padding-left: 240px;
  transition: padding-left 0.3s ease-in-out;

  ${({ isCollapsed, theme }) =>
    isCollapsed
      ? StyledLayoutCollapsed
      : isCollapsed === null &&
        css`
          @media screen and (max-width: ${theme.breakpoints.xxl}) {
            ${StyledLayoutCollapsed}
          }
        `}
`;

const StyledWrapperContent = styled.div`
  width: 100%;
  min-height: 100vh;
  padding-top: ${({ theme }) => theme.heights.header};
`;

type Props = {
  children?: ReactNode;
  title?: string;
  profileName: string;
  isLogged: boolean;
  isCollapsed: boolean;
  onCollapse: (shouldCollaspe: boolean) => void;
  links: SidebarLink[];
  hideSidebarContent?: boolean;
  variant?: LayoutVariant;
  extraInfo?: ReactNode;
  className?: string;
  onClickProfile?: () => void;
  onClickDashboard?: () => void;
};

export default function AuthLayout({
  children,
  title,
  isCollapsed,
  isLogged,
  profileName,
  onCollapse,
  links,
  hideSidebarContent,
  variant,
  extraInfo,
  className,
  onClickProfile,
  onClickDashboard,
}: Props) {
  return (
    <StyledLayoutBase
      className={className}
      title={title}
      isCollapsed={isCollapsed}
      customHeader={
        <AuthHeader
          profileName={profileName}
          isLogged={isLogged}
          variant={variant}
          logoHref={process.env.NEXT_PUBLIC_INDEX_URL}
          onClickProfile={onClickProfile}
          onClickDashboard={onClickDashboard}>
          {extraInfo}
        </AuthHeader>
      }>
      <AuthSidebar
        links={links}
        hideSidebarContent={hideSidebarContent}
        isCollapsed={isCollapsed}
        onCollapse={onCollapse}
        onClickProfile={onClickProfile}
      />
      <StyledWrapperContent>{children}</StyledWrapperContent>
    </StyledLayoutBase>
  );
}
