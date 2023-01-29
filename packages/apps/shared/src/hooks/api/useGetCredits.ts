import { useQuery, UseQueryOptions } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { Credit } from '../../types';
import { api } from '../../api';

export const GET_CREDITS = 'GET_CREDITS';

export const getCredits = async (params?: Partial<Credit>, headers?: AxiosRequestHeaders) => {
  const { data: credits } = await api.get<Credit[]>('/credits', {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
    params,
  });

  return credits;
};

const useGetCredits = <T = Credit[]>(
  params: Partial<Credit>,
  options?: UseQueryOptions<Credit[], unknown, T, [typeof GET_CREDITS, typeof params]>
) => useQuery([GET_CREDITS, params], () => getCredits(params), options);

export default useGetCredits;
