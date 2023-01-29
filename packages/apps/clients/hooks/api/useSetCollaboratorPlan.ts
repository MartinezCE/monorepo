import { useMutation, useQueryClient } from 'react-query';
import { api, AxiosError } from '@wimet/apps-shared';
import { toast } from 'react-toastify';
import { GET_COLLABORATORS } from './useGetCollaborators';

export type UserPlanPayload = {
  userPlanId: number;
  userId: number;
};

export const setCollaboratorPlan = async (payload: UserPlanPayload) => {
  await api.put('/user/plan', payload);
  return true;
};

const useSetCollaboratorPlan = () => {
  const queryClient = useQueryClient();
  return useMutation(setCollaboratorPlan, {
    onSuccess: async () => {
      Promise.all([queryClient.invalidateQueries(GET_COLLABORATORS)]);
      toast.success('El usuario fue asociado al plan');
    },
    onError: error => {
      toast.error((error as AxiosError)?.message || 'There was an error.');
    },
  });
};

export default useSetCollaboratorPlan;
