import { useQuery, UseQueryOptions } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { api, Location } from '@wimet/apps-shared';

export const GET_ALL_LOCATIONS = 'GET_ALL_LOCATIONS';

export const getAllLocation = async (companyId?: number, headers?: AxiosRequestHeaders) => {
  if (!companyId) return [];
  const { data: locations } = await api.get(`/companies/${companyId}/locations`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });
  return locations as Location[];
};

const useGetAllLocations = <T = Location[]>(
  companyId?: number,
  options?: UseQueryOptions<Location[], unknown, T, typeof GET_ALL_LOCATIONS>
) => useQuery(GET_ALL_LOCATIONS, () => getAllLocation(companyId), { ...options });

export default useGetAllLocations;
