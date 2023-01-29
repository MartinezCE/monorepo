import { useMutation, UseMutationOptions } from 'react-query';
import { api, ClientLocation } from '@wimet/apps-shared';

export type UpdateLocationPayload = {
  companyId: number;
  name?: string;
  address?: string;
  city?: string;
  country?: string;
  state?: string;
  postalCode?: string;
  streetName?: string;
  streetNumber?: string;
  isAddressValid?: boolean;
  description?: string;
  stateId?: number;
  latitude: number;
  longitude: number;
  tourUrl: string;
  accessCode: string;
  comments: string;
};

export const updateLocation = async (locationId: number, payload: UpdateLocationPayload) => {
  const { data: location } = await api.patch(`/clients-locations/${locationId}`, payload);
  return location as ClientLocation;
};

const useUpdateLocation = (
  locationId: number,
  options?: UseMutationOptions<ClientLocation | Partial<ClientLocation>, unknown, UpdateLocationPayload>
) => useMutation((payload: UpdateLocationPayload) => updateLocation(locationId, payload), options);

export default useUpdateLocation;
