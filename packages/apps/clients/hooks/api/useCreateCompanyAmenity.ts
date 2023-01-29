import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { Amenity, api } from '@wimet/apps-shared';
import { GET_COMPANY_AMENITIES } from './useGetCompanyAmenities';

type NewAmenityParam = {
  name: string;
};

export const createCompanyAmenity = async (companyId: number, newAmenity: NewAmenityParam) => {
  const { data: amenity } = await api.post<Amenity>(`/companies/${companyId}/amenities`, newAmenity);
  return amenity;
};

const useCreateCompanyAmenity = (
  companyId: number,
  options?: UseMutationOptions<Amenity | Partial<Amenity>, unknown, NewAmenityParam>
) => {
  const queryClient = useQueryClient();

  return useMutation(newAmenity => createCompanyAmenity(companyId, newAmenity), {
    onSuccess: () => queryClient.invalidateQueries(GET_COMPANY_AMENITIES),
    ...options,
  });
};

export default useCreateCompanyAmenity;
