import { useQuery, UseQueryOptions } from 'react-query';
import { api, User } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_USERS_BLUEPRINT = 'GET_USERS_BLUEPRINT';

export const getPlan = async (blueprintId?: number | string, headers?: AxiosRequestHeaders) => {
  const { data: users } = await api.get(`/blueprints/${blueprintId}/getusers`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });

  return users.users;
};

const useGetUsersBlueprint = (
  blueprintId: number | string,
  options?: UseQueryOptions<unknown | [], unknown, User[], [typeof GET_USERS_BLUEPRINT, typeof blueprintId]>
) => useQuery([GET_USERS_BLUEPRINT, blueprintId], () => getPlan(blueprintId), { staleTime: 0, ...options });

export default useGetUsersBlueprint;
