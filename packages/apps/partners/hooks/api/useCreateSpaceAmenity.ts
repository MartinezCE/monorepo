import { useMutation, UseMutationOptions } from 'react-query';
import { toast } from 'react-toastify';
import { api, SpaceAmenity } from '@wimet/apps-shared';

type NewAmenityParam = {
  name: string;
};

export const createSpaceAmenity = async (spaceId: string, newAmenity: NewAmenityParam) => {
  try {
    const { data: amenity } = await api.post(`/spaces/${spaceId}/amenities`, newAmenity);
    return amenity as SpaceAmenity;
  } catch (e) {
    toast.error((e as Error).message);
    return {} as Partial<SpaceAmenity>;
  }
};

const useCreateSpaceAmenity = (
  spaceId: string,
  options?: UseMutationOptions<SpaceAmenity | Partial<SpaceAmenity>, unknown, NewAmenityParam>
) => useMutation((newAmenity: NewAmenityParam) => createSpaceAmenity(spaceId, newAmenity), options);

export default useCreateSpaceAmenity;
