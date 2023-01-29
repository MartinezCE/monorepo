/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from 'react-query';
import { api } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_COMPANY_SURVEY_DATA = 'GET_COMPANY_SURVEY_DATA';

export const getSurveyData = async (formId: string, headers?: AxiosRequestHeaders) => {
  const { data: survey } = await api.get(`/form/${formId}`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });

  return survey;
};

const useGetSurveyData = (formId: string) => useQuery([GET_COMPANY_SURVEY_DATA, formId], () => getSurveyData(formId));

export default useGetSurveyData;
