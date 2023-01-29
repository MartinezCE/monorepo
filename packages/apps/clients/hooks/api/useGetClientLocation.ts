import { useQuery, UseQueryOptions } from 'react-query';
import { api, ClientLocation } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_CLIENT_LOCATION = 'GET_CLIENT_LOCATION';

export const getLocation = async (id?: string, headers?: AxiosRequestHeaders) => {
  const { data: location } = await api.get<Partial<ClientLocation>>(`/clients-locations/${id}`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });

  return location;
};

const useGetClientLocation = <T = Partial<ClientLocation>>(
  id: string,
  options?: UseQueryOptions<Partial<ClientLocation>, unknown, T, [typeof GET_CLIENT_LOCATION, typeof id]>
) => useQuery([GET_CLIENT_LOCATION, id], () => getLocation(id), { ...options });

export default useGetClientLocation;
