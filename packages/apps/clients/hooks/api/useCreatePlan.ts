import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { api, ClientPlan } from '@wimet/apps-shared';
import { GET_COMPANY_PLANS } from './useGetCompanyPlans';

export type CreatePlanPayload = {
  name: string;
  maxPersonalCredits: number;
  maxReservationCredits: number;
  startDate: Date;
  users: number[];
};

export const createPlan = async (companyId: number, payload: CreatePlanPayload) => {
  const { data: plan } = await api.post(`/companies/${companyId}/plans`, payload);
  return plan as ClientPlan;
};

const useCreatePlan = (
  companyId: number,
  options?: UseMutationOptions<ClientPlan | Partial<ClientPlan>, unknown, CreatePlanPayload>
) => {
  const queryClient = useQueryClient();
  return useMutation(payload => createPlan(companyId, payload), {
    onSuccess: async () => queryClient.invalidateQueries([GET_COMPANY_PLANS]),
    ...options,
  });
};

export default useCreatePlan;
