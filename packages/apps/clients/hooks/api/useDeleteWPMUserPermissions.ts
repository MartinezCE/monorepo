import { api } from '@wimet/apps-shared';
import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { GET_COMPANY_WPM_USERS } from './useGetCompanyWPMUsers';

export const deleteUserPermissions = async (userId: number) => {
  try {
    await api.delete(`/users/${userId}/wmp-permissions`);
  } catch (e) {
    toast.error((e as Error).message);
  }
};

const useDeleteWPMUserPermissions = (options?: UseMutationOptions<unknown, unknown, unknown>) => {
  const queryClient = useQueryClient();

  return {
    ...useMutation(deleteUserPermissions, {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_COMPANY_WPM_USERS, { isWPMEnabled: true }]);
      },
      ...options,
    }),
  };
};

export default useDeleteWPMUserPermissions;
