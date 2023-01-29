import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { api } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';
import { GET_COMPANY_SURVEYS } from './useGetCompanySurveys';

export const deleteSurvey = async (formId: string, headers?: AxiosRequestHeaders) => {
  await api.delete(`/form/${formId}`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });

  return true;
};

const useDeleteSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteSurvey, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(GET_COMPANY_SURVEYS);
      toast.success('Encuesta eliminada con éxito');
    },
  });
};

export default useDeleteSurvey;
