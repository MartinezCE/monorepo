import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { Link, images } from '@wimet/apps-shared';
import banner from '../../../../public/images/plans_banner.jpg';

const StyledWrapper = styled.div`
  width: 100%;
  position: relative;
  height: 232px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  & span {
    height: 100% !important;
    border-bottom-right-radius: 8px;
    border-top-right-radius: 8px;
  }
`;

const StyledImage = styled(Image)`
  object-fit: contain;
  object-position: right;
  border-bottom-right-radius: 8px;
  border-top-right-radius: 8px;
`;

const StyledContent = styled.div`
  position: absolute;
  padding: 68px 176px 68px 48px;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const StyledTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.blue};
`;
const StyledSubtitle = styled.div`
  font-size: 16px;
  font-weight: 200;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.darkGray};
  width: 379px;
  margin-top: 16px;
`;

const ExploreLink = styled(Link)`
  column-gap: 8px;
  margin-top: 10px;
  border: 1px solid transparent;
  &:hover {
    border-color: ${({ theme }) => theme.colors.blue};
  }
`;

const IconArrowRight = styled(images.ArrowRight)`
  width: 20px;
  height: 20px;
`;

const StyledBlueCirclesWrapper = styled.div`
  position: absolute;
  top: 30px;
  right: 84px;
`;

const StyledLightBlueCircle = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 48px;
  height: 48px;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.colors.lightBlue};
`;
const StyledDarkBlueCircle = styled.div`
  position: relative;
  width: 26px;
  height: 26px;
  border-radius: 100%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: ${({ theme }) => theme.colors.blue};
`;

const StyledGrayCircle = styled.div`
  position: absolute;
  width: 26px;
  height: 26px;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.colors.darkGray};
  top: 160px;
  right: 30px;
`;

const PlanBanner = () => (
  <StyledWrapper>
    <StyledImage src={banner} />
    <StyledBlueCirclesWrapper>
      <StyledLightBlueCircle>
        <StyledDarkBlueCircle />
      </StyledLightBlueCircle>
    </StyledBlueCirclesWrapper>
    <StyledGrayCircle />
    <StyledContent>
      <StyledTextWrapper>
        <StyledTitle>Comienza a usar tus planes</StyledTitle>
        <StyledSubtitle>Elige los espacios de trabajo que mejor se adapten a tus necesidades.</StyledSubtitle>
      </StyledTextWrapper>
      <ExploreLink href='/workplace-manager'>
        Explora workspaces
        <IconArrowRight />
      </ExploreLink>
    </StyledContent>
  </StyledWrapper>
);

export default PlanBanner;
