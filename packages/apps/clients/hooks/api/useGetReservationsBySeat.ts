import { useQuery, UseQueryOptions } from 'react-query';
import { api, WPMReservation } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_RESERVATIONS_BY_SEAT = 'GET_RESERVATIONS_BY_SEAT';

export const getReservationsBySeat = async (seatId: number, headers?: AxiosRequestHeaders) => {
  const date = Date();
  const { data } = await api.get<WPMReservation[]>(`/seat-reservations/${seatId}?selectedDate=${date}`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });
  return data;
};

const useGetReservationsBySeat = <T = WPMReservation[]>(
  seatId: number,
  queryOptions?: UseQueryOptions<WPMReservation[], unknown, T, typeof GET_RESERVATIONS_BY_SEAT>
) => useQuery(GET_RESERVATIONS_BY_SEAT, () => getReservationsBySeat(seatId), { ...queryOptions });

export default useGetReservationsBySeat;
