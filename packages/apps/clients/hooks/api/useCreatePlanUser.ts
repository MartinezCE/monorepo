import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { api, AxiosError } from '@wimet/apps-shared';
import { toast } from 'react-toastify';
import { GET_PLAN_USERS } from './useGetPlanUsers';
import { GET_COMPANY_USERS } from './useGetCompanyUsers';

export type CreatePlanUserPayload = {
  users: number[];
};

export const createPlanUser = async (planId: number, payload: CreatePlanUserPayload) => {
  const { data: planUsers } = await api.post(`/plans/${planId}/users`, payload);
  return planUsers;
};

const useCreatePlanUser = (planId: number, options?: UseMutationOptions<unknown, unknown, CreatePlanUserPayload>) => {
  const queryClient = useQueryClient();
  return useMutation(payload => createPlanUser(planId, payload), {
    onSuccess: async () =>
      Promise.all([queryClient.invalidateQueries(GET_PLAN_USERS), queryClient.invalidateQueries(GET_COMPANY_USERS)]),
    onError: error => {
      toast.error((error as AxiosError)?.message || 'There was an error.');
    },
    ...options,
  });
};

export default useCreatePlanUser;
