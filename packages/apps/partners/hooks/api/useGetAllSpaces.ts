import { useQuery, UseQueryOptions } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { api, Space } from '@wimet/apps-shared';

export const GET_ALL_SPACES = 'GET_ALL_SPACES';

export const getAllSpaces = async (locationId?: string, headers?: AxiosRequestHeaders) => {
  if (!locationId) return [];
  const { data: spaces } = await api.get(`/locations/${locationId}/spaces`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });
  return spaces as Space[];
};

const useGetAllSpaces = <T = Space[]>(
  locationId?: string,
  options?: UseQueryOptions<Space[], unknown, T, [typeof GET_ALL_SPACES, typeof locationId]>
) => useQuery([GET_ALL_SPACES, locationId], () => getAllSpaces(locationId), { ...options });

export default useGetAllSpaces;
