import { useQuery, UseQueryOptions } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { api } from '../../api';
import { State } from '../../types';

export const GET_ALL_STATES = 'GET_ALL_STATES';

export const getAllStates = async (companyId?: number, headers?: AxiosRequestHeaders) => {
  if (!companyId) return [];
  const { data: states } = await api.get(`/countries/${companyId}/states`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });
  return states;
};

export const useGetAllStates = <T = State[]>(
  companyId?: number,
  options?: UseQueryOptions<State[], unknown, T, [typeof GET_ALL_STATES, typeof companyId]>
) => useQuery([GET_ALL_STATES, companyId], () => getAllStates(companyId), { ...options });
