import { useQuery, UseQueryOptions } from 'react-query';
import { api, WPMReservation } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_MY_WPM_RESERVATIONS = 'GET_MY_WPM_RESERVATIONS';

export const getMyWPMReservations = async (headers?: AxiosRequestHeaders) => {
  const { data } = await api.get<WPMReservation[]>('/user/me/wpm-reservations', {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });
  return data;
};

const useGetMyWPMReservations = <T = WPMReservation[]>(
  queryOptions?: UseQueryOptions<WPMReservation[], unknown, T, typeof GET_MY_WPM_RESERVATIONS>
) => useQuery(GET_MY_WPM_RESERVATIONS, () => getMyWPMReservations(), queryOptions);

export default useGetMyWPMReservations;
