import { useQuery, UseQueryOptions } from 'react-query';
import { api, WPMReservationType } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_WPM_RESERVATION_TYPES = 'GET_WPM_RESERVATION_TYPES';

export const getWPMReservationTypes = async (headers?: AxiosRequestHeaders) => {
  const { data: reservationTypes } = await api.get<WPMReservationType[]>('/seat-reservations/types', {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });

  return reservationTypes;
};

const useGetWPMReservationTypes = <T = WPMReservationType[]>(
  options?: UseQueryOptions<WPMReservationType[], unknown, T, typeof GET_WPM_RESERVATION_TYPES>
) => useQuery(GET_WPM_RESERVATION_TYPES, () => getWPMReservationTypes(), { ...options });

export default useGetWPMReservationTypes;
