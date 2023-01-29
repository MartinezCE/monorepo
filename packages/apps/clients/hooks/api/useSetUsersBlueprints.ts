import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { api } from '@wimet/apps-shared';
import { GET_COMPANY_WPM_USERS } from './useGetCompanyWPMUsers';

export enum ApplyTo {
  ALL = 'ALL',
  TEAM = 'TEAM',
  USER = 'USER',
}

type Payload = {
  to: ApplyTo;
  userId?: number;
  teamId?: number;
  blueprints: {
    id: number;
    amenityIds: number[];
  }[];
};

export const setUsersBlueprints = async (
  companyId: string | number,
  payload?: Payload,
  headers?: AxiosRequestHeaders
) => {
  const { to, userId, teamId, ...rest } = payload || {};
  const suffix = to === ApplyTo.USER ? userId : 'batch';

  const { data } = await api.post<[]>(`/companies/${companyId}/users-blueprints/${suffix}`, rest, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
    params: { teamId },
  });
  return data;
};

const useSetUsersBlueprints = (companyId: string | number, options?: UseMutationOptions<[], unknown, Payload>) => {
  const queryClient = useQueryClient();

  return useMutation((payload?: Payload) => setUsersBlueprints(companyId, payload), {
    ...options,
    onSuccess: async (...rest) => {
      await queryClient.invalidateQueries(GET_COMPANY_WPM_USERS);
      options?.onSuccess?.(...rest);
    },
  });
};

export default useSetUsersBlueprints;
