import { useQuery, UseQueryOptions } from 'react-query';
import { api, WPMReservation } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_ME_RESERVATIONS = 'GET_ME_RESERVATIONS';

type Params = { locationId: string | number; date?: Date };

export const getMeReservations = async (params: Params, headers?: AxiosRequestHeaders) => {
  const { data } = await api.get<WPMReservation[]>('/user/me/seat-reservations', {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
    params,
  });
  return data;
};

const useGetMeReservations = <T = WPMReservation[]>(
  params: Params,
  queryOptions?: UseQueryOptions<WPMReservation[], unknown, T, typeof GET_ME_RESERVATIONS>
) => useQuery(GET_ME_RESERVATIONS, () => getMeReservations(params), { ...queryOptions });

export default useGetMeReservations;
