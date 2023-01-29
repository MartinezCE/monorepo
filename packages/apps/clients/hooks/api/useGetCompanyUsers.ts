import { useQuery, UseQueryOptions } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { api, User } from '@wimet/apps-shared';

export const GET_COMPANY_USERS = 'GET_COMPANY_USERS';

export type GetCompanyUsersParams = {
  havePlans?: boolean;
};

export const getCompanyUsers = async (
  companyId: number,
  params?: GetCompanyUsersParams,
  headers?: AxiosRequestHeaders
) => {
  const { data: companyUsers } = await api.get<User[]>(`/companies/${companyId}/users`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
    params,
  });
  return companyUsers;
};

export const useGetCompanyUsers = <T = User[]>(
  companyId: number,
  params?: GetCompanyUsersParams,
  options?: UseQueryOptions<User[], unknown, T, [typeof GET_COMPANY_USERS, typeof params]>
) => useQuery([GET_COMPANY_USERS, params], () => getCompanyUsers(companyId, params), options);
