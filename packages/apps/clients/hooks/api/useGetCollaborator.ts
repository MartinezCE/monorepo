import { useQuery, UseQueryOptions } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { api, Collaborator } from '@wimet/apps-shared';

export const GET_COLLABORATOR = 'GET_COLLABORATOR';

export const getCollaborator = async (companyId: number, collaboratorId: number, headers?: AxiosRequestHeaders) => {
  const { data: collaborator } = await api.get<Collaborator>(
    `/companies/${companyId}/collaborators/${collaboratorId}`,
    {
      headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
    }
  );
  return collaborator;
};

export const useGetCollaborator = <T = Collaborator>(
  companyId: number,
  collaboratorId: number,
  options?: UseQueryOptions<Collaborator, unknown, T, [typeof GET_COLLABORATOR, typeof collaboratorId]>
) => useQuery([GET_COLLABORATOR, collaboratorId], () => getCollaborator(companyId, collaboratorId), options);
