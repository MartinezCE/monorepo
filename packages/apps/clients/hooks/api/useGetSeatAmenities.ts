import { useQuery, UseQueryOptions } from 'react-query';
import { Amenity, api } from '@wimet/apps-shared';

export const GET_SEAT_AMENITIES = 'GET_SEAT_AMENITIES';

export const getSeatAmenities = async (companyId: string | number, blueprintId?: string | number) => {
  const { data: amenities } = await api.get<Amenity[]>(`/companies/${companyId}/seats-amenities`, {
    params: { blueprintId },
  });

  return amenities;
};

const useGetSeatAmenities = <T = Amenity[]>(
  companyId: string | number,
  blueprintId?: string | number,
  options?: UseQueryOptions<Amenity[], unknown, T, [typeof GET_SEAT_AMENITIES, typeof companyId, typeof blueprintId]>
) => useQuery([GET_SEAT_AMENITIES, companyId, blueprintId], () => getSeatAmenities(companyId, blueprintId), options);

export default useGetSeatAmenities;
