import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { api, CompanyWPMUser } from '@wimet/apps-shared';
import { toast } from 'react-toastify';
import { GET_COMPANY_WPM_USERS } from './useGetCompanyWPMUsers';

type Payload = {
  isWPMEnabled: boolean;
  users: number[];
};

export const switchUsersWPM = async (companyId: string | number, payload?: Payload, headers?: AxiosRequestHeaders) => {
  const { data: companyUsers } = await api.post<CompanyWPMUser[]>(`/companies/${companyId}/users-wpm`, payload, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });
  return companyUsers;
};

const useSwitchUsersWPM = (
  companyId: string | number,
  options?: UseMutationOptions<CompanyWPMUser[], unknown, Payload>
) => {
  const queryClient = useQueryClient();

  return useMutation((payload?: Payload) => switchUsersWPM(companyId, payload), {
    ...options,
    onSuccess: async (...rest) => {
      await queryClient.invalidateQueries(GET_COMPANY_WPM_USERS);
      options?.onSuccess?.(...rest);
      toast.success('El usuario fue modificado correctamente');
    },
  });
};

export default useSwitchUsersWPM;
