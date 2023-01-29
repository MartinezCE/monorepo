/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from 'react-query';
import { api, AxiosError, useGetMe } from '@wimet/apps-shared';
import { GET_COMPANY_TEAM } from './useGetCompanyTeam';
import { GET_COMPANY_TEAMS } from './useGetCompanyTeams';

export type TeamCreditsPayload = {
  credits: number;
  paymentType: string;
};

export const createTeamCredits = async (companyId: number, teamId: string, payload: TeamCreditsPayload) => {
  const { data: credits } = await api.post(`/companies/${companyId}/teams/${teamId}/credits`, payload);
  return credits;
};

const useCreateCompanyTeamCredits = (teamId: string, options?: any) => {
  const queryClient = useQueryClient();
  const { data: user } = useGetMe();

  return useMutation(
    (payload: TeamCreditsPayload) => createTeamCredits(Number(user?.companies[0].id), teamId, payload),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([GET_COMPANY_TEAMS]);
        await queryClient.invalidateQueries([GET_COMPANY_TEAM, teamId]);
        toast.success('Se habilitaron los créditos con éxito');
      },
      onError: error => {
        toast.error((error as AxiosError)?.message || 'There was an error.');
      },
      ...options,
    }
  );
};

export default useCreateCompanyTeamCredits;
