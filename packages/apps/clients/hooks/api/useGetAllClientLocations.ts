import { useQuery, UseQueryOptions } from 'react-query';
import { api, ClientLocation, LocationStatus } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_ALL_CLIENT_LOCATIONS = 'GET_ALL_CLIENT_LOCATIONS';

type Params = {
  status?: LocationStatus;
  floorsRequired?: boolean;
};

export const getAllClientLocations = async (params?: Params, headers?: AxiosRequestHeaders) => {
  const { data: location } = await api.get<ClientLocation[]>('/clients-locations/', {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
    params,
  });
  return location;
};

const useGetAllClientLocations = (
  params?: Params,
  options?: UseQueryOptions<ClientLocation[], unknown, ClientLocation[], typeof GET_ALL_CLIENT_LOCATIONS>
) => useQuery(GET_ALL_CLIENT_LOCATIONS, () => getAllClientLocations(params), options);
export default useGetAllClientLocations;
