import { useQuery, UseQueryOptions } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { Discount, api } from '@wimet/apps-shared';

export const GET_SPACE_DISCOUNTS = 'GET_SPACE_DISCOUNTS';

export const getSpaceDiscounts = async (headers?: AxiosRequestHeaders) => {
  const { data: discounts } = await api.get('/space-discounts', {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });
  return discounts as Discount[];
};

const useGetSpaceDiscounts = <T = Discount[]>(
  options?: UseQueryOptions<Discount[], unknown, T, typeof GET_SPACE_DISCOUNTS>
) => useQuery(GET_SPACE_DISCOUNTS, () => getSpaceDiscounts(), { ...options });

export default useGetSpaceDiscounts;
