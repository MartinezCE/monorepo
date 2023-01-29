import React, { useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { Tab } from '@wimet/apps-shared';
import Text from '../../UI/Text';
import { BlockOfferList } from '../../../interfaces/api';
import { getImageProps } from '../../../utils/images';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 112px 24px;
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 160px 24px;
  }
`;

const StyledTabContainer = styled.div`
  margin-top: 24px;
  width: 100%;
  display: flex;
  justify-content: center;
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-top: 44px;
  }
`;

const StyledBenefitsGrid = styled.div`
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  text-align: center;
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 95px;
    row-gap: 70px;
    margin-top: 60px;
    text-align: left;
  }
`;

const StyledTitle = styled.h4`
  font-size: 16px;
  line-height: 20px;
`;

const StyledDescription = styled(Text)`
  max-width: 331px;
  margin-top: 8px;
`;

const StyledBenefitItem = styled.div`
  display: grid;
  grid-template-columns: 61px 1fr;
  column-gap: 30px;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    &:not(:last-child) {
      margin-bottom: 40px;
    }
  }
`;

const StyledBenefitImage = styled.div`
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    max-width: 52px;
    margin-bottom: 16px;
  }
`;

type Props = BlockOfferList;

export default function OfferList({ title, views }: Props) {
  const tabs = (views || [])?.map((tab, i) => ({ id: tab.id || i, label: tab.title || '', items: tab.items || [] }));
  type Tab = typeof tabs[0];

  const [active, setActive] = useState(tabs[0]);

  return (
    <StyledWrapper id='por-que-wimet'>
      <h4 data-aos='fade-up'>{title}</h4>
      <StyledTabContainer data-aos='fade-up'>
        <Tab tabs={tabs} active={active} onChange={tab => setActive(tab as Tab)} />
      </StyledTabContainer>
      <StyledBenefitsGrid>
        {active?.items?.map(item => (
          <StyledBenefitItem key={item.id} data-aos='fade-up'>
            <StyledBenefitImage>
              <Image {...getImageProps(item.image)} />
            </StyledBenefitImage>
            <div>
              <StyledTitle>{item?.title}</StyledTitle>
              <StyledDescription>{item?.description}</StyledDescription>
            </div>
          </StyledBenefitItem>
        ))}
      </StyledBenefitsGrid>
    </StyledWrapper>
  );
}
