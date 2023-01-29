import { api } from '@wimet/apps-shared';
import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { GET_USERS_BLUEPRINT } from './useGetUsersBlueprint';

type Props = {
  blueprintId: string | number;
  userId: string | number;
};

export const deleteUserBlueprint = async ({ blueprintId, userId }: Props) => {
  await api.delete(`/blueprints/${blueprintId}/removeusers/${userId}`);
};

const useDeleteUserBlueprint = (options?: UseMutationOptions<unknown, unknown, unknown>) => {
  const queryClient = useQueryClient();

  return useMutation(deleteUserBlueprint, {
    onSuccess: () => {
      queryClient.invalidateQueries([GET_USERS_BLUEPRINT]);
      toast.success('Se quito el usuario del piso correctamente.');
    },
    ...options,
  });
};

export default useDeleteUserBlueprint;
