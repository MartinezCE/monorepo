import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Link, BreakpointBox, Hamburger, letScroll, lockScroll } from '@wimet/apps-shared';
import styled, { css } from 'styled-components';
import Button from '../UI/Button';
import MobileMenu from './MobileMenu';
import { IconHiringTag, IconUser, Logo, LogoMonogram } from '../../assets/images';
import { Layout, ShadowBox } from '../mixins';
import { HeaderApiResponse } from '../../hooks/api/useGetHeader';
import { Locale } from '../../interfaces/api';
import { StyledDemoLink, StyledMenuLink } from '../UI/HeaderLeftAreaMenu/commonStyle';
import HeaderLeftAreaMenu from '../UI/HeaderLeftAreaMenu';

type StyledFixedWrapperProps = {
  isFixed?: boolean;
};

const StyledFixedWrapper = styled.div<StyledFixedWrapperProps>`
  top: 0;
  left: 0;
  width: 100vw;
  max-width: 100%;
  z-index: 9;

  ${({ isFixed }) =>
    isFixed &&
    css`
      position: fixed;
    `}
`;

type StyledWrapperProps = {
  isOnTop?: boolean;
};

const StyledWrapper = styled.nav<StyledWrapperProps>`
  height: 80px;
  position: relative;
  z-index: 9;
  ${({ isOnTop }) => isOnTop && ShadowBox}
  background-color: ${({ theme }) => theme.colors.white};
  transition: box-shadow 0.3s ease-in-out;
`;

type StyledHeaderContentProps = {
  isFluid?: boolean;
};

const StyledHeaderContent = styled(BreakpointBox)<StyledHeaderContentProps>`
  ${Layout};
  height: 100%;
  align-items: center;
  justify-content: space-between;
  ${({ isFluid }) =>
    isFluid &&
    css`
      max-width: 100%;
    `};
`;

const StyledLogoLink = styled.a`
  display: flex;
  align-items: center;
`;

const StyledLogo = styled(Logo)`
  width: 143px;
  height: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    width: 116px;
    height: 19px;
  }
`;

const StyledLogoMobile = styled(LogoMonogram)`
  width: 43px;
  height: 24px;
`;

const IconHiring = styled(IconHiringTag)`
  margin-left: 10px;
  margin-top: 1px;
`;

const StyledLeftContainer = styled.div`
  display: flex;
`;

const StyledButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  > * {
    &:not(:first-child) {
      margin-left: 26px;
      @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
        margin-left: 16px;
      }
    }
  }
  button {
    @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
      padding: 12px 11px;
    }
  }
`;

const StyledButtonsContainerMobile = styled.div`
  display: flex;
  align-items: center;
  a {
    &:not(:last-child) {
      margin-right: 24px;
    }
    &:first-child {
      font-weight: 700;
    }
  }
`;

const StyledUserIconWrapper = styled.div`
  position: relative;
  width: 13px;
  height: 14px;
`;

const StyledMenuLinkMobile = styled(StyledMenuLink)`
  color: ${({ theme }) => theme.colors.blue};
`;

const StyledHiringLink = styled(Link)`
  padding: 0;
  border: none;
  &:hover {
    background: none;
  }
`;

const UserIcon = () => (
  <StyledUserIconWrapper>
    <IconUser />
  </StyledUserIconWrapper>
);

type Props = Locale & {
  isFixed?: boolean;
  isFluid?: boolean;
  data: HeaderApiResponse;
};

const Header = ({ isFixed, isFluid, data }: Props) => {
  const [isOnTop, setIsOnTop] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const router = useRouter();

  const onScroll = () => setIsOnTop(window.scrollY > 0);

  useEffect(() => {
    if (!window || !isFixed) return;
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll); // eslint-disable-line consistent-return
  }, [isFixed]);

  const handleOpenMenu = () => {
    if (!openMenu) {
      lockScroll();
    } else {
      letScroll();
    }
    setOpenMenu(prev => !prev);
  };

  return (
    <StyledFixedWrapper isFixed={isFixed}>
      <StyledWrapper isOnTop={isOnTop || openMenu}>
        <StyledHeaderContent initialDisplay='flex' breakpoints={{ lg: 'none' }} isFluid={isFluid}>
          <StyledLeftContainer>
            <StyledLogoLink href='/'>
              <StyledLogo />
              <StyledHiringLink variant='outline' href='https://bit.ly/trabajar-en-wimet'>
                <IconHiring />
              </StyledHiringLink>
            </StyledLogoLink>
            <HeaderLeftAreaMenu data={data} isOnTop={isOnTop} />
          </StyledLeftContainer>

          <StyledButtonsContainer>
            <StyledDemoLink href={data?.attributes?.requestDemo.url || ''}>
              {data?.attributes?.requestDemo.name || ''}
            </StyledDemoLink>
            <Button onClick={() => router.push(data?.attributes?.register.url || '')}>
              {data?.attributes?.register.name}
            </Button>
            <Button
              variant='outline'
              trailingIcon={<UserIcon />}
              onClick={() => router.push(data?.attributes?.login.url || '')}>
              {data?.attributes?.login.name}
            </Button>
          </StyledButtonsContainer>
        </StyledHeaderContent>

        <StyledHeaderContent initialDisplay='none' breakpoints={{ lg: 'flex' }}>
          <StyledLogoLink href='/'>
            <StyledLogoMobile />
          </StyledLogoLink>
          <StyledButtonsContainerMobile>
            <StyledMenuLinkMobile onClick={() => router.push(data?.attributes?.register.url || '')}>
              {data?.attributes?.register.name}
            </StyledMenuLinkMobile>
            <StyledMenuLinkMobile onClick={() => router.push(data?.attributes?.login.url || '')}>
              {data?.attributes?.login.name}
            </StyledMenuLinkMobile>
            <Hamburger isOpen={openMenu} handleClick={handleOpenMenu} />
          </StyledButtonsContainerMobile>
        </StyledHeaderContent>
      </StyledWrapper>
      <BreakpointBox initialDisplay='none' breakpoints={{ lg: 'block' }}>
        {openMenu && <MobileMenu data={data} />}
      </BreakpointBox>
    </StyledFixedWrapper>
  );
};

export default Header;
