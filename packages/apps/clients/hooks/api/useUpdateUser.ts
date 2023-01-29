import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { api, GET_ME } from '@wimet/apps-shared';
import { toast } from 'react-toastify';

export type UpdateUserPayload = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  userRole?: {
    value?: string;
  };
};

export const updateUser = async (payload: UpdateUserPayload) => {
  try {
    await api.patch('/user', payload);
  } catch (e) {
    toast.error((e as Error).message);
  }
};

const useUpdateUser = (options?: UseMutationOptions<unknown, unknown, UpdateUserPayload>) => {
  const queryClient = useQueryClient();
  return useMutation((payload: UpdateUserPayload) => updateUser(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([GET_ME]);
      toast.success('Datos actualizados correctamente');
    },
    ...options,
  });
};

export default useUpdateUser;
