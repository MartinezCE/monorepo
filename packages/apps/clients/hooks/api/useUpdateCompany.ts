import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { api, GET_ME } from '@wimet/apps-shared';
import { toast } from 'react-toastify';

export type UpdateCompanyPayload = {
  name?: string;
  websiteUrl?: string;
  peopleAmount?: number;
  stateId?: number;
};

export const updateCompany = async (companyId: number, payload: UpdateCompanyPayload) => {
  try {
    await api.patch(`/companies/${companyId}`, payload);
  } catch (e) {
    toast.error((e as Error).message);
  }
};

const useUpdateCompany = (companyId: number, options?: UseMutationOptions<unknown, unknown, UpdateCompanyPayload>) => {
  const queryClient = useQueryClient();
  return useMutation((payload: UpdateCompanyPayload) => updateCompany(companyId, payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([GET_ME]);
      toast.success('Datos actualizados correctamente');
    },
    ...options,
  });
};

export default useUpdateCompany;
