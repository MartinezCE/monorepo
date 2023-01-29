import React, { useState } from 'react';
import { Collapsible } from '@wimet/apps-shared';
import styled, { css } from 'styled-components';
import MoreInfoButton from '../../../MoreInfoButton';
import PlanTag from '../../PlanTag';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledCollapsible = styled(Collapsible)<{ isOpen: boolean }>`
  margin-top: 48px;
  & > p {
    font-size: 14;
    color: ${({ theme }) => theme.colors.darkGray};
    font-weight: 100;
  }
  ${({ isOpen }) =>
    isOpen &&
    css`
      margin-bottom: 48px;
    `}
`;

const StyledRightContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

type Props = {
  tagText: string | React.ReactNode;
  moreInfo: React.ReactNode;
  extraHeaderInfo?: React.ReactNode;
};

const NewPlanCardHeader = ({ tagText, moreInfo, extraHeaderInfo }: Props) => {
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);

  return (
    <StyledWrapper>
      <StyledHeaderWrapper>
        <PlanTag>{tagText}</PlanTag>
        <StyledRightContent>
          {extraHeaderInfo}
          <MoreInfoButton onToogle={(value: boolean) => setIsMoreInfoOpen(value)} />
        </StyledRightContent>
      </StyledHeaderWrapper>
      <StyledCollapsible isOpen={isMoreInfoOpen}>{moreInfo}</StyledCollapsible>
    </StyledWrapper>
  );
};

export default NewPlanCardHeader;
