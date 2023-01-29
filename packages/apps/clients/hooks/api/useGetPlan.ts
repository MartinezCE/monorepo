import { useQuery, UseQueryOptions } from 'react-query';
import { api, ClientPlan } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_PLAN = 'GET_PLAN';

export const getPlan = async (planId?: number | string, headers?: AxiosRequestHeaders) => {
  const { data: plan } = await api.get<ClientPlan>(`/plans/${planId}`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });

  return plan;
};

const useGetPlan = <T = ClientPlan>(
  planId: number | string,
  options?: UseQueryOptions<ClientPlan, unknown, T, [typeof GET_PLAN, typeof planId]>
) => useQuery([GET_PLAN, planId], () => getPlan(planId), { staleTime: 0, ...options });

export default useGetPlan;
