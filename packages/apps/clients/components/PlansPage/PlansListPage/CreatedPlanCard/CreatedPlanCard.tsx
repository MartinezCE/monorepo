import React from 'react';
import { ClientPlan, PlanStatus } from '@wimet/apps-shared';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { parseISO } from 'date-fns';
import CreatedPlanCardHeader from './CreatedPlanCardHeader';
import CreatedPlanCardActions from './CreatedPlanCardActions';
import CreatedPlanCardCredits from './CreatedPlanCardCredits';
import CreatedPlanCardDates from './CreatedPlanCardDates';

const StyledWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px 8px;
  cursor: pointer;
`;

export type PlanStatusProps = {
  status: PlanStatus;
};

const StyledContentWrapper = styled.div`
  position: relative;
  padding: 24px;
`;

// const StyledPriceText = styled.div`
//   font-size: 16px;
//   font-weight: 500;
//   color: ${({ theme }) => theme.colors.darkBlue};
//   margin-top: 25px;
//   ${disabledConfig};
// `;

type Props = {
  plan: ClientPlan;
  onDelete?: (planId: number) => void;
  onActivate?: () => void;
};

const CreatedPlanCard = ({ plan, onActivate, onDelete }: Props) => {
  const router = useRouter();

  const handleEdit = () => router.push(`/pass/plans/${plan.id}`);

  return (
    <StyledWrapper>
      <CreatedPlanCardHeader
        planId={plan.id}
        name={plan.name}
        status={plan.status}
        collaboratorsCount={plan.users.length}
        type={plan.planType.name}
        onClick={handleEdit}
      />
      <StyledContentWrapper>
        <CreatedPlanCardCredits planId={plan.id} status={plan.status} availableCredits={plan.planType.initialCredits} />
        <CreatedPlanCardDates
          status={plan.status}
          start={parseISO(plan.startDate)}
          renovation={plan.planRenovations[0]}
        />
        {/* {plan.planType.price && (
          <StyledPriceText status={plan.status}>{`ARS $${plan.planType.price} /mes`}</StyledPriceText>
        )} */}
        <CreatedPlanCardActions
          status={plan.status}
          onActivate={onActivate}
          onDelete={() => onDelete?.(plan.id)}
          disabledDelete={!plan.isDeletable}
          onEdit={handleEdit}
        />
      </StyledContentWrapper>
    </StyledWrapper>
  );
};

export default CreatedPlanCard;
