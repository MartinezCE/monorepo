import { api } from '@wimet/apps-shared';
import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { GET_CLIENT_LOCATION } from './useGetClientLocation';

export const deleteBlueprint = async (blueprintId: number) => {
  try {
    await api.delete(`/blueprints/${blueprintId}`);
  } catch (e) {
    toast.error((e as Error).message);
  }
};

const useDeleteBlueprint = (locationId: string, options?: UseMutationOptions<unknown, unknown, unknown>) => {
  const queryClient = useQueryClient();

  return {
    ...useMutation(deleteBlueprint, {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_CLIENT_LOCATION, locationId]);
      },
      ...options,
    }),
  };
};

export default useDeleteBlueprint;
