import { useQuery, UseQueryOptions } from 'react-query';
import { api, PlanRenovation } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_PLAN_RENOVATIONS = 'GET_PLAN_RENOVATIONS';

export const getPlanRenovations = async (planId?: number | string, headers?: AxiosRequestHeaders) => {
  const { data: planRenovations } = await api.get<PlanRenovation[]>(`/plans/${planId}/renovations`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });

  return planRenovations;
};

const useGetPlanRenovations = <T = PlanRenovation[]>(
  planId: number | string,
  options?: UseQueryOptions<PlanRenovation[], unknown, T, [typeof GET_PLAN_RENOVATIONS, typeof planId]>
) => useQuery([GET_PLAN_RENOVATIONS, planId], () => getPlanRenovations(planId), options);

export default useGetPlanRenovations;
