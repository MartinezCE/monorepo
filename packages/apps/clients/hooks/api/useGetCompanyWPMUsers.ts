import { useQuery, UseQueryOptions } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { api, CompanyWPMUser } from '@wimet/apps-shared';

export const GET_COMPANY_WPM_USERS = 'GET_COMPANY_WPM_USERS';

type GetCompanyWPMUsersParams = Partial<CompanyWPMUser>;

export const getCompanyWPMUsers = async (
  companyId: number,
  params?: GetCompanyWPMUsersParams,
  headers?: AxiosRequestHeaders
) => {
  const { data: companyUsers } = await api.get<CompanyWPMUser[]>(`/companies/${companyId}/users-wpm`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
    params,
  });
  return companyUsers;
};

export const useGetCompanyWPMUsers = <T = CompanyWPMUser[]>(
  companyId: number,
  params?: GetCompanyWPMUsersParams,
  options?: UseQueryOptions<CompanyWPMUser[], unknown, T, [typeof GET_COMPANY_WPM_USERS, typeof params]>
) => useQuery([GET_COMPANY_WPM_USERS, params], () => getCompanyWPMUsers(companyId, params), options);
