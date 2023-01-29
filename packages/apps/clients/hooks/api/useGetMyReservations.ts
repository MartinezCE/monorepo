import { useQuery, UseQueryOptions } from 'react-query';
import { api, HourlySpaceReservation } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_MY_RESERVATIONS = 'GET_MY_RESERVATIONS';

export const getMyReservations = async (headers?: AxiosRequestHeaders) => {
  const { data } = await api.get<HourlySpaceReservation[]>('/user/reservations', {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });
  return data;
};

const useGetMyReservations = <T = HourlySpaceReservation[]>(
  queryOptions?: UseQueryOptions<HourlySpaceReservation[], unknown, T, typeof GET_MY_RESERVATIONS>
) => useQuery(GET_MY_RESERVATIONS, () => getMyReservations(), { ...queryOptions });

export default useGetMyReservations;
