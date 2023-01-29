import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { api, PlanStatus, useGetMe } from '@wimet/apps-shared';
import { toast } from 'react-toastify';
import { GET_COMPANY_TEAM } from './useGetCompanyTeam';

export type UpdateTeampPayload = {
  name?: string;
  maxPersonalCredits?: number;
  maxReservationCredits?: number;
  users?: number[];
  status?: PlanStatus;
};

export const updateTeam = async (companyId: number, teamId: string, payload: UpdateTeampPayload) => {
  const { data: team } = await api.patch(`/companies/${companyId}/teams/${teamId}`, payload);
  return team;
};

const useUpdateCompanyTeam = (teamId: string, options?: UseMutationOptions<unknown, unknown, UpdateTeampPayload>) => {
  const queryClient = useQueryClient();
  const { data: user } = useGetMe();

  return useMutation(payload => updateTeam(Number(user?.companies[0].id), teamId, payload), {
    onSuccess: async () => {
      await Promise.all([queryClient.invalidateQueries([GET_COMPANY_TEAM, teamId])]);
      toast.success('Plan actualizado correctamente');
    },
    ...options,
  });
};

export default useUpdateCompanyTeam;
