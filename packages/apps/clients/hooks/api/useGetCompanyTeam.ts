/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from 'react-query';
import { api, useGetMe } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_COMPANY_TEAM = 'GET_COMPANY_TEAM';

export const getCompanyTeam = async (companyId: number, teamId: string, headers?: AxiosRequestHeaders) => {
  const { data: teams } = await api.get(`/companies/${companyId}/teams/${teamId}`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });

  return teams;
};

const useGetCompanyTeam = (teamId: string, queryOptions?: any, headers?: AxiosRequestHeaders) => {
  const { data: user } = useGetMe();

  return useQuery([GET_COMPANY_TEAM, teamId], () => getCompanyTeam(Number(user?.companies[0].id), teamId, headers), {
    ...queryOptions,
  });
};

export default useGetCompanyTeam;
