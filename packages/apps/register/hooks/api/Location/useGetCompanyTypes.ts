import { useQuery, UseQueryOptions } from 'react-query';
import { api } from '@wimet/apps-shared';

type CompanyTypes = {
  id: number;
  value: string;
  createdAt: string;
  updatedAt: string;
}[];

export const GET_COMPANY_TYPES = 'GET_COMPANY_TYPES';

export const getCompanyTypes = async () => {
  const companyTypes: CompanyTypes = await api.get('/companies/types').then(r => r.data);
  return companyTypes;
};

const useGetCompanyTypes = <T = CompanyTypes>(
  options?: UseQueryOptions<CompanyTypes, unknown, T, typeof GET_COMPANY_TYPES>
) => useQuery(GET_COMPANY_TYPES, getCompanyTypes, { ...options });

export default useGetCompanyTypes;
