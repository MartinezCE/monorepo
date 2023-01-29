import { useMutation, useQueryClient } from 'react-query';
import { api, AxiosError } from '@wimet/apps-shared';
import { toast } from 'react-toastify';
import { GET_COLLABORATORS } from './useGetCollaborators';

export type UserRolePayload = {
  userRoleId: number;
  userId: number;
};

export const setCollaboratorRole = async (payload: UserRolePayload) => {
  await api.put('/user/role', payload);
  return true;
};

const useSetCollaboratorRole = () => {
  const queryClient = useQueryClient();
  return useMutation(setCollaboratorRole, {
    onSuccess: async () => {
      queryClient.invalidateQueries(GET_COLLABORATORS);
      toast.success('El rol fue modificado correctamente.');
    },
    onError: error => {
      toast.error((error as AxiosError)?.message || 'There was an error.');
    },
  });
};

export default useSetCollaboratorRole;
