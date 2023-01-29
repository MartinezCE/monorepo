import { useQuery, UseQueryOptions } from 'react-query';
import { api, Plan } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_USER_PLAN = 'GET_USER_PLAN';

type Response = Plan;

export const getUserPlan = async (headers?: AxiosRequestHeaders) => {
  const { data: plan } = await api.get<Response>('/user/plan', {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });

  return plan;
};

const useGetUserPlan = <T = Response>(options?: UseQueryOptions<Response, unknown, T, typeof GET_USER_PLAN>) =>
  useQuery(GET_USER_PLAN, () => getUserPlan(), options);

export default useGetUserPlan;
