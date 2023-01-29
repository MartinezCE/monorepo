import { ClientPlan } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';
import { parseISO } from 'date-fns';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { dehydrate, QueryClient } from 'react-query';
import styled from 'styled-components';
import Layout from '../../../../components/Layout';
import PlanDetailContent from '../../../../components/PlansPage/PlanDetailPage/PlanDetailContent';
import PlanDetailHeaderForm from '../../../../components/PlansPage/PlanDetailPage/PlanDetailHeaderForm';
import useGetPlan, { getPlan, GET_PLAN } from '../../../../hooks/api/useGetPlan';

const StyledLayout = styled(Layout)`
  padding-right: 0 !important;
`;

const StyledWrapper = styled.div``;

const PlanDetailPage = () => {
  const { query } = useRouter();
  const { data: plan = {} as ClientPlan } = useGetPlan(query.planId as string);

  return (
    <StyledLayout>
      <StyledWrapper>
        <PlanDetailHeaderForm
          planId={plan.id}
          name={plan.name}
          type={plan.planType.name}
          start={parseISO(plan.startDate)}
          renovation={plan.planRenovations[0]}
          maxPersonalCredits={plan.maxPersonalCredits}
          maxReservationCredits={plan.maxReservationCredits}
          availableCredits={plan.planType.initialCredits}
        />
        <PlanDetailContent planId={plan.id} />
      </StyledWrapper>
    </StyledLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  const planId = context.query.planId as string;

  await queryClient.prefetchQuery([GET_PLAN, planId], () =>
    getPlan(planId, context.req.headers as AxiosRequestHeaders)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default PlanDetailPage;
