import { useQuery, UseQueryOptions } from 'react-query';
import { api, WPMReservation } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_SEAT_WPM_RESERVATION = 'GET_SEAT_WPM_RESERVATION';

type Params = {
  selectedDate?: Date;
};

export const getSeatWPMReservation = async (seatId: number, params: Params, headers?: AxiosRequestHeaders) => {
  const { data: reservation } = await api.get<WPMReservation[]>(`/seat-reservations/${seatId}`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
    params,
  });
  return reservation;
};

const useGetSeatWPMReservation = (
  seatId: number,
  params: Params = {},
  options?: UseQueryOptions<
    WPMReservation[],
    unknown,
    WPMReservation[],
    [typeof GET_SEAT_WPM_RESERVATION, typeof seatId, typeof params]
  >
) =>
  useQuery([GET_SEAT_WPM_RESERVATION, seatId, params], () => getSeatWPMReservation(seatId, params), {
    staleTime: 0,
    ...options,
  });

export default useGetSeatWPMReservation;
