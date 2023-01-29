import React, { useState } from 'react';
import { Link, images, PageNotAvailable, useGetMe, DeleteBaseModal } from '@wimet/apps-shared';
import styled from 'styled-components';
import Layout from '../../../components/Layout';
import PlanBanner from '../../../components/PlansPage/PlansListPage/PlanBanner';
import CreatedPlanCard from '../../../components/PlansPage/PlansListPage/CreatedPlanCard';
import useGetClientCompanyPlans from '../../../hooks/api/useGetCompanyPlans';
import useDeletePlan from '../../../hooks/api/useDeletePlan';

const StyledWrapper = styled.div`
  padding: 72px 75px 98px 104px;
`;

const StyledHeaderWrapper = styled.div``;
const StyledHeaderActions = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 40px;
`;

const StyledGridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(316px, 1fr));
  grid-column-gap: 37px;
  grid-row-gap: 40px;
`;

const StyledBannerWrapper = styled.div`
  margin-top: 64px;
`;

const PlansPage = () => {
  const [deletePlanModal, setDeletePlanModal] = useState<{ isOpen: boolean; planId?: number }>({ isOpen: false });
  const { data: userData } = useGetMe();
  const { data = [] } = useGetClientCompanyPlans(Number(userData?.companies[0].id));
  const { mutateAsync, isLoading } = useDeletePlan();

  const handleDelete = async (planId: number) => setDeletePlanModal({ isOpen: true, planId });
  const handleCancel = () => setDeletePlanModal({ isOpen: false });

  return (
    <Layout>
      <StyledWrapper>
        <StyledHeaderWrapper>
          <h6>Planes</h6>
          <StyledHeaderActions>
            <Link href='/pass/plans/list' trailingIcon={<images.TinyMore />} fullWidth={false}>
              Agregar Planes
            </Link>
          </StyledHeaderActions>
        </StyledHeaderWrapper>
        {data.length ? (
          <>
            <StyledGridWrapper>
              {data.map(plan => (
                <CreatedPlanCard key={plan.id} plan={plan} onDelete={handleDelete} />
              ))}
            </StyledGridWrapper>
            <StyledBannerWrapper>
              <PlanBanner />
            </StyledBannerWrapper>
          </>
        ) : (
          <PageNotAvailable title='Te invitamos a crear tus planes' noDescription />
        )}
      </StyledWrapper>
      {deletePlanModal.isOpen && (
        <DeleteBaseModal
          title='¿Eliminar plan?'
          onConfirm={() => mutateAsync({ planId: Number(deletePlanModal.planId) })}
          onCancel={handleCancel}
          onClose={handleCancel}
          disableButton={isLoading}
        />
      )}
    </Layout>
  );
};
export default PlansPage;
