/* eslint-disable jsx-a11y/anchor-is-valid */
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import { api } from '../../api';
import { images } from '../../assets';
import { LogoMonogram } from '../../assets/images';
import { LayoutVariant } from '../../types';
import { SidebarLink } from '../AuthSidebar';
import BaseHeader from '../BaseHeader';
import BreakpointBox from '../BreakpointBox';
import Dropdown from '../Dropdown';
import Hamburger from '../Hamburger';
import Link from '../Link';
import MobileMenu from '../MobileMenu';
import Popup from '../Popup';
import Profile from '../Profile';
import { letScroll, lockScroll } from '../../utils';

const StyledLogoLink = styled(Link)`
  display: flex;
  align-items: center;
`;

const StyledLogoLinkMobile = styled.a`
  display: flex;
  align-items: center;
`;

const StyledLogo = styled(images.Logo)`
  width: 116px;
  height: 19px;
`;

const StyledInfo = styled.div`
  display: flex;
  align-items: center;
`;

const StyledLeftContainer = styled.div`
  display: flex;
`;
const StyledHiringLink = styled(Link)`
  padding: 0;
  border: none;
  &:hover,
  &:active,
  &:focus {
    background: none;
  }
`;

const StyledSeparator = styled.div`
  border-top: 1px solid ${({ theme: { colors } }) => colors.lightGray};
`;

const StyledDropdown = styled(Dropdown)<{ variant: LayoutVariant }>`
  position: static;
  width: 270px;
  > a:last-child {
    ${({ theme: { colors }, variant }) => {
      let baseColor = colors.orange;
      switch (variant) {
        case 'orange':
          baseColor = colors.orange;
          break;
        case 'blue':
          baseColor = colors.blue;
          break;
        case 'sky':
          baseColor = colors.sky;
          break;
        default:
          baseColor = colors.orange;
          break;
      }
      return `color: ${baseColor}`;
    }};
  }
  > a {
    &:hover {
      background-color: ${({ theme: { colors } }) => colors.lightGray};
      ${({ theme: { colors }, variant }) => {
        let baseColor = colors.orange;
        switch (variant) {
          case 'orange':
            baseColor = colors.orange;
            break;
          case 'blue':
            baseColor = colors.blue;
            break;
          case 'sky':
            baseColor = colors.sky;
            break;
          default:
            baseColor = colors.orange;
            break;
        }
        return `
      color: ${baseColor}
    `;
      }};
      font-weight: 700;
    }
  }
`;

const StyledLogoutLogo = styled(images.Logout)`
  margin-right: 10px;
`;

const StyledLink = styled.a`
  display: flex;
  text-decoration: none;
  padding: 20px 24px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 300;
  cursor: pointer;
`;

const StyledHeaderVersion = styled(BreakpointBox)`
  justify-content: space-between;
  width: 100%;
`;

const StyledLogoMobile = styled(LogoMonogram)`
  width: 43px;
  height: 24px;
`;

const StyledMobileSection = styled(BreakpointBox)`
  top: 0;
  left: 0;
  width: 100vw;
  max-width: 100%;
  z-index: 9;
  position: fixed;
`;

type Props = {
  profileName?: string;
  isLogged?: boolean;
  isFixed?: boolean;
  noAbsolute?: boolean;
  logoHref?: string;
  variant?: LayoutVariant;
  children?: ReactNode;
  logoExtra?: ReactNode;
  hreflogoExtra?: string;
  leftContent?: ReactNode;
  links?: SidebarLink[];
  onClickProfile?: () => void;
  onClickDashboard?: () => void;
};

export default function AuthHeader({
  profileName,
  isLogged,
  isFixed,
  noAbsolute,
  logoHref,
  variant,
  children,
  logoExtra,
  hreflogoExtra,
  leftContent,
  links,
  onClickProfile,
  onClickDashboard,
}: Props) {
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState(false);

  const handleOpenMenu = () => {
    if (!openMenu) {
      lockScroll();
    } else {
      letScroll();
    }
    setOpenMenu(prev => !prev);
  };

  const handleLogout = async () => {
    api.post('/auth/sign-out').then(() => router.replace(`${process.env.NEXT_PUBLIC_LOGIN_URL}`));
  };
  return (
    <BaseHeader isLogged={isLogged} isFixed={isFixed} noAbsolute={noAbsolute} variant={variant}>
      <StyledHeaderVersion initialDisplay='flex' breakpoints={{ lg: 'none' }}>
        <StyledLeftContainer>
          <StyledLogoLink href={logoHref} noBackground>
            <StyledLogo />
          </StyledLogoLink>
          {hreflogoExtra && logoExtra && (
            <StyledHiringLink variant='outline' href={hreflogoExtra}>
              {logoExtra}
            </StyledHiringLink>
          )}
          {leftContent}
        </StyledLeftContainer>

        <StyledInfo>
          {children}{' '}
          {profileName && (
            <Popup container={<Profile name={profileName} variant={variant} />}>
              <StyledDropdown variant={variant}>
                <StyledLink onClick={onClickDashboard}>Dashboard</StyledLink>
                <StyledLink onClick={onClickProfile}>Perfil</StyledLink>
                <StyledSeparator />
                <StyledLink onClick={handleLogout}>
                  <StyledLogoutLogo />
                  Cerrar sesión
                </StyledLink>
              </StyledDropdown>
            </Popup>
          )}
        </StyledInfo>
      </StyledHeaderVersion>
      <StyledHeaderVersion initialDisplay='none' breakpoints={{ sm: 'flex' }}>
        <StyledLogoLinkMobile href='/'>
          <StyledLogoMobile />
        </StyledLogoLinkMobile>
        <Hamburger isOpen={openMenu} handleClick={handleOpenMenu} />
      </StyledHeaderVersion>
      <StyledMobileSection initialDisplay='none' breakpoints={{ lg: 'block' }}>
        {openMenu && <MobileMenu links={links} variant={variant} />}
      </StyledMobileSection>
    </BaseHeader>
  );
}
