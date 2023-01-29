import { AxiosRequestHeaders } from 'axios';
import { UseQueryOptions, useQuery } from 'react-query';
import { api } from '../../api';
import { SpaceType } from '../../types';

export const GET_ALL_SPACES_TYPES = 'GET_ALL_SPACES_TYPES';

export const getAllSpacesTypes = async (headers?: AxiosRequestHeaders) => {
  const { data: spacesTypes } = await api.get('/spaces/types/all', {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });
  return spacesTypes;
};

export const useGetAllSpacesTypes = <T = SpaceType[]>(
  options: UseQueryOptions<SpaceType[], unknown, T, typeof GET_ALL_SPACES_TYPES> = {}
) => useQuery(GET_ALL_SPACES_TYPES, () => getAllSpacesTypes(), { ...options });
