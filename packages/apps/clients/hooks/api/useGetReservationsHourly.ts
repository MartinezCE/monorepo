import { useQuery, UseQueryOptions } from 'react-query';
import { api, HourlySpaceReservation } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_RESERVATIONS_HOURLY = 'GET_RESERVATIONS_HOURLY';

export const getReservationsHourly = async (companyId: string | number, headers?: AxiosRequestHeaders) => {
  const { data } = await api.get<HourlySpaceReservation[]>(`/companies/${companyId}/reservations-revenue/clients`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });
  return data;
};

const useGetReservationsHourly = <T = HourlySpaceReservation[]>(
  companyId: string | number,
  queryOptions?: UseQueryOptions<
    HourlySpaceReservation[],
    unknown,
    T,
    [typeof GET_RESERVATIONS_HOURLY, typeof companyId]
  >
) =>
  useQuery([GET_RESERVATIONS_HOURLY, companyId], () => getReservationsHourly(companyId), {
    staleTime: 0,
    ...queryOptions,
  });

export default useGetReservationsHourly;
