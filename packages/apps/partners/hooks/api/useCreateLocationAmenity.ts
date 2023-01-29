import { useMutation, UseMutationOptions } from 'react-query';
import { toast } from 'react-toastify';
import { api, LocationAmenity } from '@wimet/apps-shared';

type NewAmenityParam = {
  name: string;
};

export const createLocationAmenity = async (locationId: string, newAmenity: NewAmenityParam) => {
  try {
    const { data: amenity } = await api.post(`/locations/${locationId}/amenities`, newAmenity);
    return amenity as LocationAmenity;
  } catch (e) {
    toast.error((e as Error).message);
    return {} as Partial<LocationAmenity>;
  }
};

const useCreateLocationAmenity = (
  locationId: string,
  options?: UseMutationOptions<LocationAmenity | Partial<LocationAmenity>, unknown, NewAmenityParam>
) => useMutation((newAmenity: NewAmenityParam) => createLocationAmenity(locationId, newAmenity), options);

export default useCreateLocationAmenity;
