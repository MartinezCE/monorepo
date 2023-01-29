import React from 'react';
import { DotsPattern, images, Link, useGetMe } from '@wimet/apps-shared';
import Image from 'next/image';
import styled from 'styled-components';
import MainHeroImage from '../../../public/images/homepage_main_hero.jpeg';

const StyledWrapper = styled.div`
  min-height: 362px;
  border-radius: 8px;
  background-color: #ffffff;
  padding-left: 48px;
  display: flex;
  margin-right: 73px;
`;

const StyledMainArea = styled.div`
  padding-top: 64px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StyledTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.orange};
  margin-bottom: 8px;
`;
const StyledSubtitle = styled.div`
  width: 292px;
  font-size: 16px;
  font-weight: 200;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.darkGray};
  margin-bottom: 24px;
`;
const StyledLink = styled(Link)`
  margin-bottom: 48px;
  color: ${({ theme }) => theme.colors.blue};
`;

const StyledActions = styled.div`
  display: flex;
`;
const StyledImageArea = styled.div`
  position: relative;
  flex: 1;
`;

const StyledWrapperImg = styled.div`
  position: absolute !important;
  top: 32px;
  right: -73px;
`;

const StyledImage = styled(Image)`
  border-radius: 8px;
`;

const StyledDotsPattern = styled(DotsPattern)`
  position: absolute;
  z-index: 1;
  right: -107px;
  bottom: 0;
  & > div {
    background-color: ${({ theme }) => theme.colors.orange};
  }
`;

const MainHero = () => {
  const { data } = useGetMe();

  return (
    <StyledWrapper>
      <StyledMainArea>
        <StyledTitle>¡Hola {data?.firstName}! Te damos la bienvenida a Wimet</StyledTitle>
        <StyledSubtitle>Conoce los beneficios de tener Wimet para tu equipo y cómo funciona.</StyledSubtitle>
        <StyledLink href='/test' trailingIcon={<images.ChevronRight />} variant='transparent' fullWidth={false}>
          Conoce más
        </StyledLink>
        <StyledActions>
          <Link href='/company/collaborators'>Invita a tus colaboradores</Link>
        </StyledActions>
      </StyledMainArea>
      <StyledImageArea>
        <StyledDotsPattern small />
        <StyledWrapperImg>
          <StyledImage src={MainHeroImage} />
        </StyledWrapperImg>
      </StyledImageArea>
    </StyledWrapper>
  );
};

export default MainHero;
