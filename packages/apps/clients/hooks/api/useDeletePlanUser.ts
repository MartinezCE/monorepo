import { api } from '@wimet/apps-shared';
import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { GET_COLLABORATORS } from './useGetCollaborators';
import { GET_COMPANY_USERS } from './useGetCompanyUsers';
import { GET_PLAN_USERS } from './useGetPlanUsers';

type Props = {
  planId: string | number;
  userId: string | number;
};

export const deletePlanUser = async ({ planId, userId }: Props) => {
  await api.delete(`/plans/${planId}/users/${userId}`);
};

const useDeletePlanUser = (options?: UseMutationOptions<unknown, unknown, unknown>) => {
  const queryClient = useQueryClient();

  return useMutation((props: Props) => deletePlanUser(props), {
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries(GET_COLLABORATORS),
        queryClient.invalidateQueries(GET_COMPANY_USERS),
        queryClient.invalidateQueries(GET_PLAN_USERS),
      ]),
    ...options,
  });
};

export default useDeletePlanUser;
