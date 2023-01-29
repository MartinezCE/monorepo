import React, { useMemo, useState } from 'react';
import { FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import * as Yup from 'yup';
import { useGetMe, User } from '@wimet/apps-shared';
import Layout from '../../../../../components/Layout';
import { PlanListData } from '../../../../../mocks';
import NewPlanConfirmationModal from '../../../../../components/PlansPage/NewPlanPage/NewPlanConfirmationModal';
import useCreatePlan from '../../../../../hooks/api/useCreatePlan';
import MonthlyPlan from '../../../../../components/PlansPage/NewPlanPage/MonthlyPlan';
import PayAsYouGoPlan from '../../../../../components/PlansPage/NewPlanPage/PayAsYouGoPlan';

export const initialValues = {
  name: '',
  collaborators: [] as User[],
  startDate: new Date(),
  maxPersonalCredits: 0,
  maxReservationCredits: 0,
  credits: 0,
  // planRulesId: null,
  // payMethod: null,
};

export type NewPlanFormValues = typeof initialValues;

const validationSchema = (showMaxPersonalCredits?: boolean) =>
  Yup.object({
    name: Yup.string().required('Nombre del plan requerido'),
    collaborators: Yup.array()
      .of(Yup.object())
      .min(1, 'Al menos un colaborador es requerido')
      .required('Colaboradores requeridos'),
    startDate: Yup.date().required('Fecha de inicio requerida'),
    ...(showMaxPersonalCredits && {
      maxPersonalCredits: Yup.number()
        .min(1, 'El número tiene que ser mayor a 0')
        .required('Máximo de créditos por persona requerido'),
    }),
    maxReservationCredits: Yup.number()
      .min(1, 'El número tiene que ser mayor a 0')
      .required('Máximo de créditos por reserva requerido'),
  });

const StyledWrapper = styled.div`
  padding: 64px 0px 233px 75px;
  display: grid;
  grid-template-columns: 1fr 495px;
  column-gap: 116px;
`;

const NewPlanPage = () => {
  const router = useRouter();
  const { planType } = router.query;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { data: userData } = useGetMe();
  const { mutateAsync } = useCreatePlan(Number(userData?.companies[0].id));
  const plan = useMemo(() => PlanListData.find(({ name }) => name === planType) || PlanListData[0], [planType]);
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema(!(plan.name === 'pay-as-you-go')),
    onSubmit: async ({ collaborators, ...rest }, _formik) => {
      try {
        await mutateAsync({ ...rest, users: collaborators.map(u => Number(u.id)) });
        setShowConfirmModal(true);
      } catch (e) {
        _formik.setTouched({});
        _formik.setSubmitting(false);
      }
    },
  });

  return (
    <Layout>
      <FormikProvider value={formik}>
        <StyledWrapper>
          {plan.name === 'monthly' && <MonthlyPlan plan={plan} userData={userData} />}
          {plan.name === 'pay-as-you-go' && <PayAsYouGoPlan plan={plan} />}
        </StyledWrapper>
      </FormikProvider>
      {!!showConfirmModal && <NewPlanConfirmationModal />}
    </Layout>
  );
};

export default NewPlanPage;
