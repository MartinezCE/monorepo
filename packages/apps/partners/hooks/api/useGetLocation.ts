import { useQuery, UseQueryOptions } from 'react-query';
import { api, Location } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_LOCATION = 'GET_LOCATION';

export const getLocation = async (id?: string, headers?: AxiosRequestHeaders) => {
  if (!id) return {} as Partial<Location>;
  const location: Location = await api
    .get(`/locations/${id}`, { headers: headers?.cookie ? { cookie: headers?.cookie } : undefined })
    .then(r => r.data);
  return location;
};

const useGetLocation = <T = Location | Partial<Location>>(
  id: string,
  options?: UseQueryOptions<Location | Partial<Location>, unknown, T, [typeof GET_LOCATION, typeof id]>
) => useQuery([GET_LOCATION, id], () => getLocation(id), { ...options });

export default useGetLocation;
