import React from 'react';
import { PlanListData } from '../../../../mocks';
import NewPlanCard from '../NewPlanCard';
import NewPlanFormFields from '../NewPlanFormFields';
import PayAsYouGoPlanCardContent from './PayAsYouGoPlanCardContent';

type Props = {
  plan: typeof PlanListData[0];
};
const PayAsYouGoPlan = ({ plan }: Props) => (
  <>
    <NewPlanFormFields />
    <NewPlanCard
      plan={plan}
      tagText='PAY AS YOU GO'
      moreInfo={
        <p>
          El plan <strong>{plan.name}</strong> es recomendado para empresas de 30 empleados o menos. <br />
          Pagarás <strong>${plan.variations[0].monthValue}</strong> por mes y recibirás{' '}
          <strong>{plan.variations[0].creditValue} créditos</strong>. Lo que corresponde a{' '}
          {plan.variations[0].visitRange} visitas a espacios por mes. En caso de no llegar a usar el total de créditos,
          estos se mantienen para el siguiente mes. Solamente tendrás que pagar por los créditos que falten para llegar
          a {plan.variations[0].creditValue} nuevamente.
        </p>
      }>
      <PayAsYouGoPlanCardContent />
    </NewPlanCard>
  </>
);

export default PayAsYouGoPlan;
