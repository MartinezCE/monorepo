import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { api, Location } from '@wimet/apps-shared';
import { GET_CLIENT_LOCATION } from './useGetClientLocation';

export type CreateFloorPayload = {
  number?: string;
};

export const createFloor = async (locationId: string | number, payload?: CreateFloorPayload) => {
  const { data: location } = await api.post(`/clients-locations/${locationId}/floors`, payload);
  return location as Location;
};

const useCreateFloor = (
  locationId: string | number,
  options?: UseMutationOptions<Location | Partial<Location>, unknown, CreateFloorPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation((payload?: CreateFloorPayload) => createFloor(locationId, payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([GET_CLIENT_LOCATION, locationId]);
    },
    ...options,
  });
};

export default useCreateFloor;
