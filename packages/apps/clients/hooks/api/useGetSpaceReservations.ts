import { useQuery, UseQueryOptions } from 'react-query';
import { api, SpaceReservation } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_SPACE_RESERVATIONS = 'GET_SPACE_RESERVATIONS';

export const getSpaceReservations = async (headers?: AxiosRequestHeaders, limit?: number, offset?: number) => {
  const { data: bookings } = await api.get<SpaceReservation[]>(`/space-reservations/?limit=${limit}&offset=${offset}`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });
  return bookings;
};

const useGetSpaceReservations = (
  options?: UseQueryOptions<SpaceReservation[], unknown, SpaceReservation[], typeof GET_SPACE_RESERVATIONS>,
  limit?: number,
  offset?: number
) => useQuery(GET_SPACE_RESERVATIONS, () => getSpaceReservations(undefined, limit, offset), options);
export default useGetSpaceReservations;
