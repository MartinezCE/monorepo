import styled, { css } from 'styled-components';
import { useState } from 'react';
import { SidebarLink } from '../AuthSidebar';
import { IconArrowDown, Logo } from '../../assets/images';
import Collapsible from '../Collapsible';

const StyledWrapper = styled.div`
  height: calc(100vh - 80px);
  width: 100%;
  z-index: 999;
  background: ${({ theme }) => theme.colors.white};
  position: fixed;
  top: 80px;
  padding: 64px 16px 40px;
  overflow: auto;
  a {
    max-width: 186px;
    white-space: normal;
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: max-content;
  min-height: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 104px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 24px;
  }
`;

const StyledMenuItem = styled.li`
  list-style: none;
  margin-bottom: 40px;
`;

const StyledSubMenuItem = styled.li`
  list-style: none;
  margin-bottom: 10px;
`;

const StyledFullLogoContainer = styled.div`
  height: 14px;
  width: 84px;
  margin-top: auto;
  align-self: flex-end;
`;

const StyledMenuLink = styled.a<{ highlighted?: boolean; variant?: string }>`
  text-decoration: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes[2]};
  font-weight: 300;
  ${({ highlighted, variant }) =>
    highlighted
      ? css`
          ${({ theme: { colors } }) => {
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
          font-weight: 500;
        `
      : css`
          color: ${({ theme }) => theme.colors.darkGray};
        `};
`;

const StyledLink = styled.a`
  white-space: nowrap;
  text-decoration: none;
  display: flex;
  flex-direction: column;
`;

const StyledLinkTitle = styled.p`
  margin-bottom: 8px;
  line-height: ${({ theme }) => theme.lineHeights[1]};
  font-size: ${({ theme }) => theme.fontSizes[3]};
  font-weight: 700;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes[0]};
    line-height: ${({ theme }) => theme.lineHeights[0]};
  }
`;

const StyledTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 20px;
`;

const StyledTitle = styled.p`
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes[2]};
`;

const StyledArrowIconWrapper = styled.div`
  position: relative;
  width: 16px;
  height: 16px;
  margin-left: 6px;
  transition: transform 0.2s ease-in-out;
`;

const SolutionTitle = ({ title }: { title: string }) => (
  <StyledTitleWrapper>
    <StyledTitle>{title}</StyledTitle>
    <StyledArrowIconWrapper>
      <IconArrowDown />
    </StyledArrowIconWrapper>
  </StyledTitleWrapper>
);

const SubMenu = ({ title, links }: { title: string; links: SidebarLink[] }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <StyledMenuItem onClick={() => setIsOpen(!isOpen)}>
      <SolutionTitle title={title} />
      <Collapsible isOpen={isOpen}>
        <ul>
          {links.map(_link => {
            const link = typeof _link === 'function' ? _link() : _link;
            return (
              <StyledSubMenuItem key={`${link.text}-${link.href}`}>
                <StyledLink href={link.href || '/'}>
                  <StyledLinkTitle>{link.text}</StyledLinkTitle>
                </StyledLink>
              </StyledSubMenuItem>
            );
          })}
        </ul>
      </Collapsible>
    </StyledMenuItem>
  );
};

const getItemLinks = (_links: SidebarLink[], variant?: string) =>
  _links.map(_link => {
    const link = typeof _link === 'function' ? _link() : _link;

    return !link.hide ? (
      <>
        {link.links ? (
          <SubMenu key={`${link.text}-${link.href}`} links={link.links} title={link.text} />
        ) : (
          <StyledMenuItem key={`${link.text}-${link.href}`} onClick={link.onClick}>
            <StyledMenuLink href={link.href} highlighted={link.active} variant={variant}>
              {link.text}
            </StyledMenuLink>
          </StyledMenuItem>
        )}
      </>
    ) : null;
  });

const MobileMenu = ({ links, variant }: { links: SidebarLink[]; variant?: string }) => (
  <StyledWrapper>
    <StyledContainer>
      <ul>{getItemLinks(links, variant)}</ul>
      <StyledFullLogoContainer>
        <Logo />
      </StyledFullLogoContainer>
    </StyledContainer>
  </StyledWrapper>
);

export default MobileMenu;
