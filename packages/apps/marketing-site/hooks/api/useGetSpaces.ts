import { useQuery } from 'react-query';
import { api, LocationStatus, Space } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_SPACES = 'GET_SPACES';
export type SpaceFilters = {
  status?: LocationStatus;
  spaceTypeId?: number;
  spaceReservationTypeId?: number;
};

export const getSpaces = async (id: number, filters?: SpaceFilters, headers?: AxiosRequestHeaders) => {
  const { data: spaces } = await api.get<Space[]>(`/locations/${id}/spaces`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
    params: {
      status: LocationStatus.PUBLISHED,
      ...filters,
    },
  });

  return spaces;
};

const useGetSpaces = (id: number, filters?: SpaceFilters, headers?: AxiosRequestHeaders) =>
  useQuery([GET_SPACES, id, filters], () => getSpaces(id, filters, headers));

export default useGetSpaces;
