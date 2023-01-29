import { useQuery, UseQueryOptions } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { Deposit, api } from '@wimet/apps-shared';

export const GET_SPACE_DEPOSITS = 'GET_SPACE_DEPOSITS';

export const getSpaceDeposits = async (headers?: AxiosRequestHeaders) => {
  const { data: deposits } = await api.get('/space-deposits', {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });
  return deposits as Deposit[];
};

const useGetSpaceDeposits = <T = Deposit[]>(
  options?: UseQueryOptions<Deposit[], unknown, T, typeof GET_SPACE_DEPOSITS>
) => useQuery(GET_SPACE_DEPOSITS, () => getSpaceDeposits(), { ...options });

export default useGetSpaceDeposits;
