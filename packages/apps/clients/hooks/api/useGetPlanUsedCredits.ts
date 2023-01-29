import { useQuery, UseQueryOptions } from 'react-query';
import { api } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_PLAN_USED_CREDITS = 'GET_PLAN_USED_CREDITS';

type UsedCredits = {
  usedCredits: number;
};

export const getPlanUsedCredits = async (planId?: number | string, headers?: AxiosRequestHeaders) => {
  const { data: plan } = await api.get<UsedCredits>(`/plans/${planId}/used-credits`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });

  return plan;
};

const useGetPlanUsedCredits = <T = UsedCredits>(
  planId: number | string,
  options?: UseQueryOptions<UsedCredits, unknown, T, [typeof GET_PLAN_USED_CREDITS, typeof planId]>
) => useQuery([GET_PLAN_USED_CREDITS, planId], () => getPlanUsedCredits(planId), { staleTime: 0, ...options });

export default useGetPlanUsedCredits;
