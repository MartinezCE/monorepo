import { api } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';
import { SeatsAvailability } from '../../types/api';

export const GET_SEATS_BY_LOCATION = 'GET_SEATS_BY_LOCATION';

export const getSeatsAvailability = async (locationId: number, headers?: AxiosRequestHeaders) => {
  const { data: seats } = await api.get<SeatsAvailability>(`/locations/${locationId}/seats/availability`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });
  return seats;
};

const useGetSeatsAvailability = (
  locationId: number,
  options?: UseQueryOptions<
    SeatsAvailability,
    unknown,
    SeatsAvailability,
    [typeof GET_SEATS_BY_LOCATION, string | number]
  >
) =>
  useQuery([GET_SEATS_BY_LOCATION, locationId], () => getSeatsAvailability(locationId), {
    ...options,
  });

export default useGetSeatsAvailability;
