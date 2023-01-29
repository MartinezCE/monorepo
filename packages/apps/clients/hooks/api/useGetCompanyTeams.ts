/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from 'react-query';
import { api } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_COMPANY_TEAMS = 'GET_COMPANY_TEAMS';

export const getTeams = async (companyId: number, headers?: AxiosRequestHeaders) => {
  const { data: teams } = await api.get(`/companies/${companyId}/teams`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });

  return teams;
};

const useGetCompanyTeams = (companyId: number, queryOptions?: any, headers?: AxiosRequestHeaders) =>
  useQuery([GET_COMPANY_TEAMS, companyId], () => getTeams(companyId, headers), { ...queryOptions });

export default useGetCompanyTeams;
