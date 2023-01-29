import { useMutation, UseMutationOptions } from 'react-query';
import { api, Location } from '@wimet/apps-shared';

export type CreateLocationPayload = {
  name: string;
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
};

export const createLocation = async (companyId: number, payload: CreateLocationPayload) => {
  const { data: location } = await api.post(`/companies/${companyId}/client-locations`, payload);
  return location as Location;
};

const useCreateLocation = (
  companyId: number,
  options?: UseMutationOptions<Location | Partial<Location>, unknown, CreateLocationPayload>
) => useMutation((payload: CreateLocationPayload) => createLocation(companyId, payload), options);

export default useCreateLocation;
