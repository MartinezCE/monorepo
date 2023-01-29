import { useQuery, UseQueryOptions } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { api, WPMReservation } from '@wimet/apps-shared';

type Params = {
  selectedDate?: Date;
};

export const GET_RESERVATIONS = 'GET_RESERVATIONS';

export const getReservations = async (params: Params, headers?: AxiosRequestHeaders) => {
  const { data: reservations } = await api.get<WPMReservation[]>('/seat-reservations', {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
    params,
  });
  return reservations;
};

export const useGetReservations = <T = WPMReservation[]>(
  params: Params = {},
  options?: UseQueryOptions<WPMReservation[], unknown, T, [typeof GET_RESERVATIONS, typeof params]>
) => useQuery([GET_RESERVATIONS, params], () => getReservations(params), options);
