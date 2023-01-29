import { useMutation, UseMutationOptions } from 'react-query';
import { api, Location } from '@wimet/apps-shared';

export type UpdateLocationPayload = {
  address: string;
  city: string;
  country: string;
  state: string;
  postalCode: string;
  streetName: string;
  streetNumber: string;
  isAddressValid: boolean;
  description: string;
  stateId: number;
  latitude: number;
  longitude: number;
  tourUrl: string | null;
  amenities: (number | undefined)[] | undefined;
  accessCode: string | null;
  comments: string | null;
};

export const updateLocation = async (locationId: number, payload: UpdateLocationPayload) => {
  const { data: location } = await api.patch(`/locations/${locationId}`, payload);
  return location as Location;
};

const useUpdateLocation = (
  locationId: number,
  options?: UseMutationOptions<Location | Partial<Location>, unknown, UpdateLocationPayload>
) => useMutation((payload: UpdateLocationPayload) => updateLocation(locationId, payload), options);

export default useUpdateLocation;
