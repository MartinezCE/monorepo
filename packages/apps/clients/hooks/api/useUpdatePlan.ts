import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { api, PlanStatus } from '@wimet/apps-shared';
import { toast } from 'react-toastify';
import { GET_COMPANY_PLANS } from './useGetCompanyPlans';
import { GET_PLAN } from './useGetPlan';
import { GET_PLAN_USERS } from './useGetPlanUsers';
import { GetCompanyUsersParams, GET_COMPANY_USERS } from './useGetCompanyUsers';

export type UpdatePlanPayload = {
  name?: string;
  maxPersonalCredits?: number;
  maxReservationCredits?: number;
  users?: number[];
  status?: PlanStatus;
};

export const updatePlan = async (planId: number | string, payload: UpdatePlanPayload) => {
  const { data: plan } = await api.patch(`/plans/${planId}`, payload);
  return plan;
};

const useUpdatePlan = (
  planId: number | string,
  getCompanyParams?: GetCompanyUsersParams,
  options?: UseMutationOptions<unknown, unknown, UpdatePlanPayload>
) => {
  const queryClient = useQueryClient();
  return useMutation(payload => updatePlan(planId, payload), {
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries([GET_COMPANY_USERS, getCompanyParams]),
        queryClient.invalidateQueries([GET_COMPANY_PLANS]),
        queryClient.invalidateQueries([GET_PLAN, planId]),
        queryClient.invalidateQueries([GET_PLAN_USERS, planId]),
      ]);
      toast.success('Plan actualizado correctamente');
    },
    ...options,
  });
};

export default useUpdatePlan;
