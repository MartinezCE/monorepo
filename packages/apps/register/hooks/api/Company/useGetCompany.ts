import { useQuery, UseQueryOptions } from 'react-query';
import { api, Company } from '@wimet/apps-shared';

export const GET_COMPANY = 'GET_COMPANY';

export const getCompany = async (id: number) => {
  const { data: company } = await api.get<Company>(`/companies/${id}`);
  return company;
};

const useGetCompany = (
  id: number,
  options?: UseQueryOptions<Company, unknown, Company, [typeof GET_COMPANY, typeof id]>
) => useQuery([GET_COMPANY, id], () => getCompany(id), options);

export default useGetCompany;
