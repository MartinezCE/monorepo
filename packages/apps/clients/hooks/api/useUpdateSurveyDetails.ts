import { useMutation, useQueryClient } from 'react-query';
import { api } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';
import { GET_COMPANY_SURVEY_DATA } from './useGetSurveyData';
import { GET_COMPANY_SURVEYS } from './useGetCompanySurveys';

type UpdateSurveyDetailsPayload = {
  formName?: string;
};

export const updateSurveyDetails = async (
  formId: string,
  payload: UpdateSurveyDetailsPayload,
  headers?: AxiosRequestHeaders
) => {
  await api.patch(`/form/${formId}`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
    payload,
  });

  return true;
};

const useUpdateSurveyDetails = (formId: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    (payload: UpdateSurveyDetailsPayload, headers?: AxiosRequestHeaders) =>
      updateSurveyDetails(formId, payload, headers),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([GET_COMPANY_SURVEY_DATA, formId]);
        await queryClient.invalidateQueries(GET_COMPANY_SURVEYS);
      },
    }
  );
};

export default useUpdateSurveyDetails;
