import { useMutation, UseMutationOptions } from 'react-query';
import { Amenity, api } from '@wimet/apps-shared';

type NewAmenityParam = {
  name: string;
};

export const createAmenity = async (newAmenity: NewAmenityParam) => {
  const { data: amenity } = await api.post<Amenity>('/amenities', newAmenity);
  return amenity;
};

const useCreateAmenity = (options?: UseMutationOptions<Amenity | Partial<Amenity>, unknown, NewAmenityParam>) =>
  useMutation(createAmenity, options);

export default useCreateAmenity;
