/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from 'react-query';
import { api, AxiosError } from '@wimet/apps-shared';
import { GET_COMPANY_TEAMS } from './useGetCompanyTeams';

export type CompanyTeamPayload = {
  name: string;
  countryId: number | null;
};

export const createTeam = async (companyId: number, payload: CompanyTeamPayload) => {
  const { data: plan } = await api.post(`/companies/${companyId}/teams`, payload);
  return plan;
};

const useCreateCompanyTeam = (companyId: number, options?: any) => {
  const queryClient = useQueryClient();
  return useMutation((payload: CompanyTeamPayload) => createTeam(companyId, payload), {
    onSuccess: async () => {
      await queryClient.invalidateQueries([GET_COMPANY_TEAMS, companyId]);
      toast.success('Equipo creado con éxito');
    },
    onError: error => {
      toast.error((error as AxiosError)?.message || 'There was an error.');
    },
    ...options,
  });
};

export default useCreateCompanyTeam;
