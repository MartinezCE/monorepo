import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { api, User } from '@wimet/apps-shared';
import { toast } from 'react-toastify';
import { GET_USERS_BLUEPRINT } from './useGetUsersBlueprint';

export const setBlueprintUsers = async (
  blueprintId: string | number,
  payload?: User[],
  headers?: AxiosRequestHeaders
) => {
  const { data } = await api.post<[]>(`/blueprints/${blueprintId}/setusers`, payload, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });
  return data;
};

const useSetBlueprintUsers = (blueprintId: string | number, options?: UseMutationOptions<[], unknown, User[]>) => {
  const queryClient = useQueryClient();

  return useMutation((payload?: User[]) => setBlueprintUsers(blueprintId, payload), {
    ...options,
    onSuccess: async (...rest) => {
      await queryClient.invalidateQueries(GET_USERS_BLUEPRINT);
      toast.success('Se asocarios los usuarios al piso correctamente.');
      options?.onSuccess?.(...rest);
    },
  });
};

export default useSetBlueprintUsers;
