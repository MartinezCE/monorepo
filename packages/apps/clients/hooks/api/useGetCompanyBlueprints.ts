import { useQuery, UseQueryOptions } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { api, BlueprintStatus, CompanyBlueprint } from '@wimet/apps-shared';

export const GET_COMPANY_BLUEPRINTS = 'GET_COMPANY_BLUEPRINTS';

type Params = {
  status?: BlueprintStatus.PUBLISHED;
};

export const getCompanyBlueprints = async (companyId: number, params?: Params, headers?: AxiosRequestHeaders) => {
  const { data: companyBlueprints } = await api.get<CompanyBlueprint[]>(`/companies/${companyId}/blueprints`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
    params,
  });
  return companyBlueprints;
};

export const useGetCompanyBlueprints = <T = CompanyBlueprint[]>(
  companyId: number,
  params?: Params,
  options?: UseQueryOptions<CompanyBlueprint[], unknown, T, typeof GET_COMPANY_BLUEPRINTS>
) => useQuery(GET_COMPANY_BLUEPRINTS, () => getCompanyBlueprints(companyId, params), options);
