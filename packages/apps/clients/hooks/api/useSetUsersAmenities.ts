import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { api } from '@wimet/apps-shared';
import { GET_COMPANY_WPM_USERS } from './useGetCompanyWPMUsers';

type Payload = {
  userId?: number;
  amenityIds: number[];
};

export const setUsersAmenities = async (
  companyId: string | number,
  payload?: Payload,
  headers?: AxiosRequestHeaders
) => {
  const { userId, ...rest } = payload || {};

  const { data } = await api.post<[]>(`/companies/${companyId}/users-amenities/${userId}`, rest, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });
  return data;
};

const useSetUsersAmenities = (companyId: string | number, options?: UseMutationOptions<[], unknown, Payload>) => {
  const queryClient = useQueryClient();

  return useMutation((payload?: Payload) => setUsersAmenities(companyId, payload), {
    ...options,
    onSuccess: async (...rest) => {
      await queryClient.invalidateQueries(GET_COMPANY_WPM_USERS);
      options?.onSuccess?.(...rest);
    },
  });
};

export default useSetUsersAmenities;
