import { useQuery, UseQueryOptions } from 'react-query';
import { api, User } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_PLAN_USERS = 'GET_PLAN_USERS';

export const getPlanUsers = async (planId?: number | string, headers?: AxiosRequestHeaders) => {
  const { data: planUsers } = await api.get<User[]>(`/plans/${planId}/users`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });

  return planUsers;
};

const useGetPlanUsers = <T = User[]>(
  planId: number | string,
  options?: UseQueryOptions<User[], unknown, T, [typeof GET_PLAN_USERS, typeof planId]>
) => useQuery([GET_PLAN_USERS, planId], () => getPlanUsers(planId), { staleTime: 0, ...options });

export default useGetPlanUsers;
