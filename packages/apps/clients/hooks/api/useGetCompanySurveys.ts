import { useQuery } from 'react-query';
import { api } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_COMPANY_SURVEYS = 'GET_COMPANY_SURVEYS';

export type CompanySurvey = {
  id: number;
  createdAt: Date;
  formLink: string;
  formName: string;
  formId: string;
  totalResponses: number;
};

export const getSurveys = async (headers?: AxiosRequestHeaders) => {
  const { data: surveys } = await api.get<CompanySurvey[]>('/form', {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });

  return surveys;
};

const useGetSurveys = () => useQuery([GET_COMPANY_SURVEYS], () => getSurveys());

export default useGetSurveys;
