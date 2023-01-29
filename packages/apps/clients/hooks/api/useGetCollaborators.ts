import { useQuery, UseQueryOptions } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { api, Collaborator } from '@wimet/apps-shared';

export const GET_COLLABORATORS = 'GET_COLLABORATORS';

export const getCollaborators = async (
  companyId: number | string,
  limit?: number,
  offset?: number,
  headers?: AxiosRequestHeaders
) => {
  const { data: collaborators } = await api.get<Collaborator[]>(
    `/companies/${companyId}/collaborators?offset=${offset}&limit=${limit}`,
    {
      headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
    }
  );
  return collaborators;
};

export const useGetCollaborators = <T = Collaborator[]>(
  companyId: number | string,
  limit?: number,
  offset?: number,
  options?: UseQueryOptions<Collaborator[], unknown, T, [typeof GET_COLLABORATORS, typeof companyId]>
) => useQuery([GET_COLLABORATORS, companyId], () => getCollaborators(companyId, limit, offset), options);
