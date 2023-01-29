import { Button, LoadingSpinner } from '@wimet/apps-shared';
import { useFormikContext } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { PlanListData } from '../../../../mocks';

import PlanTag from '../PlanTag';
import NewPlanCardHeader from './NewPlanCardHeader';

const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0px 20px 62px rgba(44, 48, 56, 0.05);
  border-radius: 8px;
  padding: 48px 40px 48px 40px;
  height: min-content;
`;
const StyledIndicatorWrapper = styled.div``;

const StyledPlanTag = styled(PlanTag)`
  position: absolute;
  text-transform: uppercase;
  left: 40px;
  top: -14px;
`;

const StyledAction = styled(Button)`
  margin-top: 48px;
`;

type Props = {
  plan: typeof PlanListData[0];
  children: React.ReactNode;
  tagText: string | React.ReactNode;
  moreInfo: React.ReactNode;
  extraHeaderInfo?: React.ReactNode;
};

const NewPlanCard = ({ plan, children, tagText, moreInfo, extraHeaderInfo }: Props) => {
  const formik = useFormikContext();
  return (
    <StyledWrapper>
      <StyledIndicatorWrapper>
        <StyledPlanTag type={plan.title} />
      </StyledIndicatorWrapper>
      <NewPlanCardHeader tagText={tagText} moreInfo={moreInfo} extraHeaderInfo={extraHeaderInfo} />
      {children}
      <StyledAction
        onClick={() => formik.submitForm()}
        trailingIcon={formik.isSubmitting ? <LoadingSpinner /> : undefined}
        disabled={formik.isSubmitting}>
        Confirmar
      </StyledAction>
    </StyledWrapper>
  );
};

export default NewPlanCard;
