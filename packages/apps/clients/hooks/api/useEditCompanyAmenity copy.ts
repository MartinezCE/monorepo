import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { Amenity, api } from '@wimet/apps-shared';
import { GET_COMPANY_AMENITIES } from './useGetCompanyAmenities';

type AmenityParam = {
  id: string | number;
  name: string;
};

export const editCompanyAmenity = async (companyId: number, params: AmenityParam) => {
  const { id, name } = params;
  const { data: amenity } = await api.patch<Amenity>(`/companies/${companyId}/amenities/${id}`, { name });
  return amenity;
};

const useEditCompanyAmenity = (
  companyId: number,
  options?: UseMutationOptions<Amenity | Partial<Amenity>, unknown, AmenityParam>
) => {
  const queryClient = useQueryClient();

  return useMutation(amenityId => editCompanyAmenity(companyId, amenityId), {
    onSuccess: () => queryClient.invalidateQueries(GET_COMPANY_AMENITIES),
    ...options,
  });
};

export default useEditCompanyAmenity;
