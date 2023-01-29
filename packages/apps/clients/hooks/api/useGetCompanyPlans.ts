import { useQuery, UseQueryOptions } from 'react-query';
import { api, ClientPlan } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_COMPANY_PLANS = 'GET_COMPANY_PLANS';

export const getCompanyPlans = async (
  companyId?: number,
  limit?: number,
  offset?: number,
  headers?: AxiosRequestHeaders
) => {
  const { data: companyPlans } = await api.get<ClientPlan[]>(
    `/companies/${companyId}/plans?limit=${limit}&offset=${offset}`,
    {
      headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
    }
  );

  return companyPlans;
};

const useGetClientCompanyPlans = <T = ClientPlan[]>(
  companyId: number,
  limit?: number,
  offset?: number,
  options?: UseQueryOptions<ClientPlan[], unknown, T, [typeof GET_COMPANY_PLANS, typeof companyId]>
) =>
  useQuery([GET_COMPANY_PLANS, companyId], () => getCompanyPlans(companyId, limit, offset), {
    staleTime: 0,
    ...options,
  });

export default useGetClientCompanyPlans;
