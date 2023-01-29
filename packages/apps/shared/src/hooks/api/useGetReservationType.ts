import { useQuery, UseQueryOptions } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { api } from '../../api';

type ReservationData = { id: string; value: string };

export const GET_RESERVATION_TYPE = 'GET_RESERVATION_TYPE';

export const getReservationType = async (headers?: AxiosRequestHeaders) => {
  const data: ReservationData[] = await api
    .get('/space-reservations/types', { headers: headers?.cookie ? { cookie: headers?.cookie } : undefined })
    .then(r => r.data);
  return data;
};

export const useGetReservationType = <T = ReservationData[]>(
  queryOptions?: UseQueryOptions<ReservationData[], unknown, T, typeof GET_RESERVATION_TYPE>
) => useQuery(GET_RESERVATION_TYPE, () => getReservationType(), { ...queryOptions });
