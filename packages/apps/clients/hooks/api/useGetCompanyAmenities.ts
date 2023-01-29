import { useQuery, UseQueryOptions } from 'react-query';
import { Amenity, api } from '@wimet/apps-shared';

export const GET_COMPANY_AMENITIES = 'GET_COMPANY_AMENITIES';

export const getCompanyAmenities = async (companyId: string | number) => {
  const { data: amenities } = await api.get<Amenity[]>(`/companies/${companyId}/amenities`);

  return amenities;
};

const useGetCompanyAmenities = <T = Amenity[]>(
  companyId: string | number,
  options?: UseQueryOptions<Amenity[], unknown, T, [typeof GET_COMPANY_AMENITIES, typeof companyId]>
) => useQuery([GET_COMPANY_AMENITIES, companyId], () => getCompanyAmenities(companyId), options);

export default useGetCompanyAmenities;
