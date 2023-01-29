/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from 'react-query';
import { api } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_COMPANY_SURVEY_SUMMARY = 'GET_COMPANY_SURVEY_SUMMARY';

export const getSurveyDetail = async (formId: string, section: string, headers?: AxiosRequestHeaders) => {
  const { data: surveys } = await api.get(`/form/${formId}/summary/${section}`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });

  return surveys;
};

const useGetSurveySummary = (formId: string, section: string, queryOptions?: any) =>
  useQuery([GET_COMPANY_SURVEY_SUMMARY, section, formId], () => getSurveyDetail(formId, section), { ...queryOptions });

export default useGetSurveySummary;
