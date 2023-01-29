import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { Amenity, api } from '@wimet/apps-shared';
import { GET_COMPANY_AMENITIES } from './useGetCompanyAmenities';

type AmenityParam = string | number;

export const deleteCompanyAmenity = async (companyId: number, amenityId: AmenityParam) => {
  const { data: amenity } = await api.delete<Amenity>(`/companies/${companyId}/amenities/${amenityId}`);
  return amenity;
};

const useDeleteCompanyAmenity = (
  companyId: number,
  options?: UseMutationOptions<Amenity | Partial<Amenity>, unknown, AmenityParam>
) => {
  const queryClient = useQueryClient();

  return useMutation(amenityId => deleteCompanyAmenity(companyId, amenityId), {
    onSuccess: () => queryClient.invalidateQueries(GET_COMPANY_AMENITIES),
    ...options,
  });
};

export default useDeleteCompanyAmenity;
