import { useQuery, UseQueryOptions } from 'react-query';
import { api, HourlySpaceReservation } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_USER_RESERVATIONS = 'GET_USER_RESERVATIONS';

export const getUserReservations = async (userId: string | number, headers?: AxiosRequestHeaders) => {
  const { data } = await api.get<HourlySpaceReservation[]>(`/users/${userId}/reservations`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });
  return data;
};

const useGetUserReservations = <T = HourlySpaceReservation[]>(
  userId: string | number,
  queryOptions?: UseQueryOptions<HourlySpaceReservation[], unknown, T, [typeof GET_USER_RESERVATIONS, typeof userId]>
) => useQuery([GET_USER_RESERVATIONS, userId], () => getUserReservations(userId), { ...queryOptions });

export default useGetUserReservations;
