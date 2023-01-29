import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { api } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';
import { GET_COMPANY_SURVEYS } from './useGetCompanySurveys';

export const activateSurvey = async (headers?: AxiosRequestHeaders) => {
  await api.post('/form/collaborators', {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });

  return true;
};

const useActivateSurvey = (headers?: AxiosRequestHeaders) => {
  const queryClient = useQueryClient();

  return useMutation(() => activateSurvey(headers), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(GET_COMPANY_SURVEYS);
      toast.success('Encuesta activada con éxito');
    },
  });
};

export default useActivateSurvey;
