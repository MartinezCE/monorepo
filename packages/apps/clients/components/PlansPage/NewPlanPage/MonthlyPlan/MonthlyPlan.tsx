import React from 'react';
import styled from 'styled-components';
import { images, useGetCredits, User } from '@wimet/apps-shared';
import { useFormikContext } from 'formik';
import { PlanListData } from '../../../../mocks';
import NewPlanCard from '../NewPlanCard';
import NewPlanFormFields from '../NewPlanFormFields';
import MonthlyPlanCardContent from './MonthlyPlanCardContent';
import { initialValues } from '../../../../pages/pass/plans/new/[planType]';

const StyledCreditsTag = styled.div`
  & span {
    color: ${({ theme }) => theme.colors.blue};
    font-weight: 500;
    font-size: 20px;
  }
  font-weight: 200;
`;

const StyledExtraWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  font-weight: 200;
  font-size: 14px;
  margin-bottom: 5px;
  & span {
    font-weight: 500;
  }
`;

const StyledCalendarIcon = styled(images.Calendar)`
  margin-right: 8px;
  transform: scale(0.73);
`;

type Props = {
  plan: typeof PlanListData[0];
  userData?: User | undefined;
};
const MonthlyPlan = ({ plan, userData }: Props) => {
  const { data: creditsPrice } = useGetCredits(
    {
      currencyId: userData?.companies[0].state.country?.currencyId,
    },
    { select: data => data[0] }
  );
  const { values } = useFormikContext<typeof initialValues>();

  return (
    <>
      <NewPlanFormFields showCreditsSlider creditsPrice={creditsPrice} />
      <NewPlanCard
        tagText={
          <StyledCreditsTag>
            <span>{values.credits || 0}</span> créditos
          </StyledCreditsTag>
        }
        plan={plan}
        extraHeaderInfo={
          <StyledExtraWrapper>
            <StyledCalendarIcon />
            <span>1-3 visitas</span>&nbsp; / mes
          </StyledExtraWrapper>
        }
        moreInfo={<p>Falta más información</p>}>
        <MonthlyPlanCardContent creditsPrice={creditsPrice} />
      </NewPlanCard>
    </>
  );
};

export default MonthlyPlan;
