import { useQuery, UseQueryOptions } from 'react-query';
import { api, HourlySpaceReservation } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_PLAN_RESERVATIONS = 'GET_PLAN_RESERVATIONS';

export const getPlanReservations = async (planId?: number | string, headers?: AxiosRequestHeaders) => {
  const { data: planReservations } = await api.get<HourlySpaceReservation[]>(`/plans/${planId}/reservations`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });

  return planReservations;
};

const useGetPlanReservations = <T = HourlySpaceReservation[]>(
  planId: number | string,
  options?: UseQueryOptions<HourlySpaceReservation[], unknown, T, [typeof GET_PLAN_RESERVATIONS, typeof planId]>
) => useQuery([GET_PLAN_RESERVATIONS, planId], () => getPlanReservations(planId), { staleTime: 0, ...options });

export default useGetPlanReservations;
