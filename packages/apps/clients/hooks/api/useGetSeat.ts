import { useQuery, UseQueryOptions } from 'react-query';
import { api, Seat } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_SEAT = 'GET_SEAT';

export const getSeat = async (seatId: number, headers?: AxiosRequestHeaders) => {
  const { data: reservation } = await api.get<Seat>(`/seats/${seatId}`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });
  return reservation;
};

const useGetSeat = (seatId: number, options?: UseQueryOptions<Seat, unknown, Seat, [typeof GET_SEAT, typeof seatId]>) =>
  useQuery([GET_SEAT, seatId], () => getSeat(seatId), options);

export default useGetSeat;
