import { LoadingSpinner, PlanStatus, pluralize } from '@wimet/apps-shared';
import React from 'react';
import styled, { css } from 'styled-components';
import useGetPlanUsedCredits from '../../../../../hooks/api/useGetPlanUsedCredits';
import type { PlanStatusProps } from '../CreatedPlanCard';

const StyledCreditsWrapper = styled.div`
  position: absolute;
  top: -22px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0px 20px 62px rgba(44, 48, 56, 0.05);
  border-radius: 8px;
  padding: 10px 18px 10px 18px;
  height: 44px;
  display: flex;
  align-items: center;
`;

const StyledCredits = styled.div`
  display: flex;
  align-items: baseline;
`;

const creditsTextColorConfig = {
  [PlanStatus.ACTIVE]: css`
    color: ${({ theme }) => theme.colors.blue};
  `,
  [PlanStatus.PENDING]: css`
    color: ${({ theme }) => theme.colors.darkGray};
  `,
  [PlanStatus.PAUSED]: css`
    color: ${({ theme }) => theme.colors.gray};
  `,
};

const StyledCreditsValueText = styled.span<PlanStatusProps>`
  font-weight: 500;
  font-size: 16px;
  ${({ status }) => creditsTextColorConfig[status]};
`;
const StyledCreditsText = styled.span<PlanStatusProps>`
  font-weight: 200;
  font-size: 16px;
  ${({ status }) => creditsTextColorConfig[status]};
`;

type Props = {
  planId: number;
  status: PlanStatus;
  availableCredits?: number | null;
};

const CreatedPlanCardCredits = ({ planId, status, availableCredits }: Props) => {
  const { data: { usedCredits } = { usedCredits: 0 }, isLoading } = useGetPlanUsedCredits(planId);

  return (
    <StyledCreditsWrapper>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <StyledCredits>
          <StyledCreditsValueText status={status}>{usedCredits}</StyledCreditsValueText>
          <StyledCreditsText status={status}>
            {!availableCredits
              ? `\xa0${pluralize(usedCredits, 'crédito')} ${pluralize(usedCredits, 'utilizado')}`
              : `/${pluralize(availableCredits, 'crédito', true)}`}
          </StyledCreditsText>
        </StyledCredits>
      )}
    </StyledCreditsWrapper>
  );
};

export default CreatedPlanCardCredits;
