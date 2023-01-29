import { api } from '@wimet/apps-shared';
import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { GET_COMPANY_PLANS } from './useGetCompanyPlans';
import { GET_COMPANY_TEAMS } from './useGetCompanyTeams';

type Props = {
  planId: string | number;
};

export const deletePlan = async ({ planId }: Props) => {
  await api.delete(`/plans/${planId}`);
};

const useDeletePlan = (options?: UseMutationOptions<unknown, unknown, unknown>) => {
  const queryClient = useQueryClient();

  return useMutation(deletePlan, {
    onSuccess: async () => {
      await queryClient.invalidateQueries([GET_COMPANY_PLANS]);
      await queryClient.invalidateQueries([GET_COMPANY_TEAMS]);
    },
    ...options,
  });
};

export default useDeletePlan;
