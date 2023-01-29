import { Fragment, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import styled, { css } from 'styled-components';
import Button from '../Button';
import SidebarBase from '../Sidebar';
import Link from '../Link';
import * as images from '../../assets/images';
import { api } from '../../api';
import Collapsible from '../Collapsible';

const StyledInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 40px 24px;
  transition: padding 0.3s ease-in-out;
  overflow-y: auto;

  ::-webkit-scrollbar {
    background-color: transparent;
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.lightBlue};
    border-radius: 16px;
    border: 0px solid ${({ theme }) => theme.colors.blue};
  }

  > * {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const StyledCollapseButton = styled(Button)`
  font-weight: ${({ theme }) => theme.fontWeight[0]};
  font-size: ${({ theme }) => theme.fontSizes[4]};
  line-height: ${({ theme }) => theme.lineHeights[2]};
  justify-content: unset;
  column-gap: 10px;
  padding: 0;
  transition: padding 0.3s ease-in-out, column-gap 0.3s ease-in-out;

  > svg {
    flex-shrink: 0;
  }
`;

const StyledChevronLeft = styled(images.ChevronLeft)`
  transition: transform 0.3s ease-in-out;
`;

const StyledSeparator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.darkBlue};
  margin: 40px 0;
  flex-shrink: 0;
`;

const StyledWrapperButtons = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

const StyledCollapsible = styled(Collapsible)`
  transition: height 0.3s ease-in-out;
`;

const StyledLinksWrapper = styled.div`
  transition: padding 0.3s ease-in-out;
  padding-left: 50px;
`;

type StyledLinkProps = {
  active?: boolean;
};

const StyledLinkBase = styled(Link)<StyledLinkProps>`
  font-weight: 300;
  justify-content: unset;
  column-gap: 16px;
  transition: padding 0.3s ease-in-out;
  white-space: pre;
`;

const StyledLink = styled(StyledLinkBase)`
  padding: 12px 16px;

  ${({ active }) =>
    active &&
    css`
      background-color: ${({ theme }) => theme.colors.darkBlue};
    `}

  > svg {
    flex-shrink: 0;
  }
`;

const StyledLinkSubmenu = styled(StyledLinkBase)`
  background-color: unset;
  padding: 6px 0px;

  ${({ active }) =>
    active &&
    css`
      font-weight: ${({ theme }) => theme.fontWeight[2]};
    `}

  &:hover,
  &:focus,
  &:active {
    background-color: unset;
    font-weight: ${({ theme }) => theme.fontWeight[2]};
  }
`;

const StyledLogoutLink = styled(StyledLink)`
  color: ${({ theme }) => theme.colors.extraDarkBlue};
  font-weight: ${({ theme }) => theme.fontWeight[2]};
  background-color: transparent;
`;

const StyledLinkText = styled.span`
  font-weight: inherit;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
  width: auto;
  overflow: hidden;
  transition: opacity 0.3s ease-in-out;
  text-align: left;
`;

type StyledSidebarBaseProps = {
  isCollapsed?: boolean | null;
};

const StyledSidebarCollapsed = css`
  width: 80px;

  ${StyledInnerWrapper} {
    padding: 40px 18px;
  }

  ${StyledChevronLeft} {
    transform: rotate(-180deg);
  }

  ${StyledLinksWrapper} {
    padding-left: 47px;
  }

  ${StyledLink} {
    padding: 12px 13px;
  }

  ${StyledCollapseButton} {
    padding: 0 10px;
    column-gap: 0px;
  }

  ${StyledLinkText} {
    opacity: 0;
  }
`;

const StyledSidebarBase = styled(SidebarBase)<StyledSidebarBaseProps>`
  width: 240px;
  transition: width 0.3s ease-in-out;
  padding-top: ${({ theme }) => theme.heights.header} !important; // TODO: Remove '!important' when mobile UI is ready

  ${({ isCollapsed, theme }) =>
    isCollapsed
      ? StyledSidebarCollapsed
      : isCollapsed === null &&
        css`
          @media screen and (max-width: ${theme.breakpoints.xxl}) {
            ${StyledSidebarCollapsed}
          }
        `}
`;

type SidebarData = {
  active?: boolean;
  icon?: JSX.Element;
  text: string;
  href?: string;
  links?: SidebarLink[];
  hide?: boolean;
  hideChilds?: boolean;
  onClick?: () => void;
};

export type SidebarLink = SidebarData | (() => SidebarData);

interface Props {
  isCollapsed: boolean;
  onCollapse: (shouldCollaspe: boolean) => void;
  links: SidebarLink[];
  hideSidebarContent?: boolean;
  onClickProfile?: () => void;
}

export default function AuthSidebar({ isCollapsed, onCollapse, links, hideSidebarContent, onClickProfile }: Props) {
  const router = useRouter();
  const nextCollapsedValue = useRef<boolean | null>(null);

  const handleLogout = async () => {
    api.post('/auth/sign-out').then(() => router.replace(`${process.env.NEXT_PUBLIC_LOGIN_URL}`));
  };
  const handleCollapse = () => {
    const shouldCollapse = isCollapsed === null ? nextCollapsedValue.current : !isCollapsed;
    onCollapse(shouldCollapse);
  };

  const handleResizeEvent = () => {
    if (isCollapsed !== null) return;
    nextCollapsedValue.current = window.innerWidth > 1600;
  };

  const getItemLinks = (_links: SidebarLink[], isSubmenu?: boolean) => {
    const ComponentLink = !isSubmenu ? StyledLink : StyledLinkSubmenu;

    return _links.map(_link => {
      const link = typeof _link === 'function' ? _link() : _link;

      return !link.hide ? (
        <Fragment key={`${link.text}-${link.href}`}>
          <ComponentLink href={link.href || '/'} variant='fifth' leadingIcon={link.icon} active={link.active} fullWidth>
            <StyledLinkText>{link.text}</StyledLinkText>
          </ComponentLink>
          {link.active && link.links && !link.hideChilds && (
            <StyledCollapsible isOpen={!isCollapsed}>
              <StyledLinksWrapper>{getItemLinks(link.links, true)}</StyledLinksWrapper>
            </StyledCollapsible>
          )}
        </Fragment>
      ) : null;
    });
  };

  useEffect(() => {
    handleResizeEvent();
    window.addEventListener('resize', () => handleResizeEvent());
    return window.removeEventListener('resize', () => handleResizeEvent());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const settingsLink = [
    {
      text: 'Configuración',
      active: router.asPath.startsWith('/profile'),
      icon: <images.Settings />,
      href: '/profile',
      links: [
        {
          text: 'Mi perfíl',
          active: router.asPath.startsWith('/profile'),
          onClick: onClickProfile,
          href: '/profile',
        },
      ],
    },
  ];

  return (
    <StyledSidebarBase isCollapsed={isCollapsed}>
      {!hideSidebarContent && (
        <StyledInnerWrapper>
          <StyledCollapseButton
            variant='fifth'
            leadingIcon={<StyledChevronLeft />}
            onClick={handleCollapse}
            noBackground
            fullWidth>
            <StyledLinkText>Menú</StyledLinkText>
          </StyledCollapseButton>
          <StyledSeparator />
          <StyledWrapperButtons>{getItemLinks(links)}</StyledWrapperButtons>
          <StyledSeparator />
          <StyledWrapperButtons>
            {getItemLinks(settingsLink)}
            <StyledLogoutLink
              onClick={handleLogout}
              variant='fourth'
              leadingIcon={<images.Logout />}
              active={router.asPath.includes('/settings')}
              fullWidth>
              <StyledLinkText>Cerrar Sesión</StyledLinkText>
            </StyledLogoutLink>
          </StyledWrapperButtons>
        </StyledInnerWrapper>
      )}
    </StyledSidebarBase>
  );
}
