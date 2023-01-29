import React from 'react';
import Image from 'next/image';
import styled, { css } from 'styled-components';
import Badge from '../UI/Badge';
import { Layout } from '../mixins';
import { LogoNegative, IconHiringTag } from '../../assets/images';
import useGetFooter from '../../hooks/api/useGetFooter';
import { getImageProps } from '../../utils/images';
import { Locale } from '../../interfaces/api';

type StyledWrapperProps = {
  isFluid?: boolean;
};

const StyledWrapper = styled.div<StyledWrapperProps>`
  min-height: 485px;
  padding: 80px 0;
  margin-top: auto;
  margin-bottom: 0;
  background-color: ${({ theme }) => theme.colors.extraDarkBlue};
  > div {
    ${Layout};
    ${({ isFluid }) =>
      isFluid &&
      css`
        max-width: 100%;
      `};
  }
  * {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const StyledBottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid ${({ theme }) => theme.colors.white};
  padding-top: 24px;
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    a:not(:first-child) {
      margin-left: 32px;
    }
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: grid;
    grid-template-columns: repeat(2, auto);
    row-gap: 24px;
    justify-content: space-between;
  }
`;

const StyledCopyright = styled.p`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes[0]};
  line-height: 16px;
  grid-area: 1 / 1 / 2 / 3;
`;

const StyledLink = styled.a`
  font-weight: normal;
  font-size: ${({ theme }) => theme.fontSizes[0]};
  line-height: 16px;
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;

  &:hover {
    font-weight: bold;
  }
`;

const StyledMediaLink = styled(StyledLink)`
  svg {
    width: 20px;
    height: 20px;
    @media screen and (min-width: ${({ theme }) => theme.breakpoints.lg}) {
      width: 24px;
      height: 24px;
    }
  }
`;

const StyledTopContainer = styled.div`
  padding-bottom: 64px;
  display: flex;
  flex-direction: column;
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: grid;
    grid-template-columns: minmax(160px, 416px) minmax(532px, 1fr);
    padding-bottom: 95px;
  }
`;

const StyledMenu = styled.ul`
  list-style: none;
`;

const StyledMenuItem = styled.li`
  display: flex;
  gap: 15px;
  align-items: center;
  &:not(:first-child) {
    margin-top: 15px;
  }
`;

const StyledSiteMap = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  flex: 1;
  column-gap: 30px;
  row-gap: 48px;
  margin-top: 30px;
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-top: 0;
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StyledColumnTitle = styled.p`
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizes[4]};
  line-height: 20px;
  color: ${({ theme }) => theme.colors.sky};
  margin-bottom: 20px;
`;

const StyledSocialsContainer = styled.div`
  gap: 12px;
  display: flex;
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-top: 51px;
    gap: 21px;
  }
`;

const StyledLogoSocialsContainer = styled.div`
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  }
`;

const StyledLogoContainer = styled.div`
  svg {
    width: 110px;
    @media screen and (min-width: ${({ theme }) => theme.breakpoints.lg}) {
      width: 160px;
    }
  }
`;

const StyledBadgeContainer = styled.div`
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const StyledIconContainer = styled.div`
  width: 24px;
  height: 24px;
  position: relative;
`;

const careersLabel = 'Carreras';
const workplaceManagerLabel = 'Workplace Manager';

type Props = Locale & {
  isFluid?: boolean;
};

const Footer: React.FC<Props> = ({ locale, isFluid }) => {
  const { data } = useGetFooter({ locale });

  return (
    <StyledWrapper isFluid={isFluid}>
      <div>
        <StyledTopContainer>
          <StyledLogoSocialsContainer>
            <StyledLogoContainer>
              <LogoNegative />
            </StyledLogoContainer>
            <StyledSocialsContainer>
              {(data?.attributes.socialLinks || []).map(item => (
                <StyledMediaLink key={item.id} href={item.url} target='_blank'>
                  <StyledIconContainer>
                    {item.icon && item.icon.data ? <Image {...getImageProps(item.icon, 'fill')} /> : item.name}
                  </StyledIconContainer>
                </StyledMediaLink>
              ))}
            </StyledSocialsContainer>
          </StyledLogoSocialsContainer>
          <StyledSiteMap>
            {(data?.attributes.column || []).map(column => (
              <div key={column.id}>
                <StyledColumnTitle>{column.name}</StyledColumnTitle>
                <StyledMenu>
                  {(column.links || []).map(item => (
                    <StyledMenuItem key={item.id}>
                      <StyledLink href={item.url}>{item.name}</StyledLink>
                      {item.name === workplaceManagerLabel && (
                        <StyledBadgeContainer>
                          {/* // TODO - Connect Badge with strapi */}
                          <Badge>Pronto</Badge>
                        </StyledBadgeContainer>
                      )}
                      {item.name === careersLabel && <IconHiringTag />}
                    </StyledMenuItem>
                  ))}
                </StyledMenu>
              </div>
            ))}
          </StyledSiteMap>
        </StyledTopContainer>
        <StyledBottomContainer>
          <StyledCopyright>{`©${new Date().getFullYear()} ${data?.attributes.copyright}`}</StyledCopyright>
          <StyledLink href={data?.attributes.privacy.url}>{data?.attributes.privacy.name}</StyledLink>
          <StyledLink href={data?.attributes.terms.url}>{data?.attributes.terms.name}</StyledLink>
        </StyledBottomContainer>
      </div>
    </StyledWrapper>
  );
};

export default Footer;
