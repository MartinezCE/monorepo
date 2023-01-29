import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { api, LocationAmenity } from '@wimet/apps-shared';
import { GET_CLIENT_LOCATION } from './api/useGetClientLocation';

export type CsvParsedItem = {
  name: string;
  spaceTypeId: number;
  isAvailable: boolean;
};

export type CsvParsedData = { [key in string]: CsvParsedItem[] };

type CreateLocationSeatsBulkPayload = {
  items: CsvParsedData;
  locationId: string | number;
};

export const createLocationSeatsBulk = async (payload: CreateLocationSeatsBulkPayload) => {
  try {
    await api.post('/locations/bulk', payload);
    return true;
  } catch (e) {
    toast.error((e as Error).message);
    return {} as Partial<LocationAmenity>;
  }
};

const useCreateLocationSeatsBulk = (locationId: string) => {
  const queryClient = useQueryClient();

  return {
    ...useMutation(createLocationSeatsBulk, {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_CLIENT_LOCATION, locationId]);
        toast.success('Posiciones creadas con éxito');
      },
    }),
  };
};

export default useCreateLocationSeatsBulk;
