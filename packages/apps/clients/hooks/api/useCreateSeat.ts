import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { api, Location, Seat } from '@wimet/apps-shared';
import { GET_SEATS } from './useGetSeats';
import { GET_SEAT_AMENITIES } from './useGetSeatAmenities';
import { GET_CLIENT_LOCATION } from './useGetClientLocation';

type Payload = Omit<Partial<Seat>, 'amenities'> & { amenities: number[] };

export const createSeat = async (blueprintId: string | number, payload?: Payload) => {
  const { data: location } = await api.post(`/blueprints/${blueprintId}/seats`, payload);
  return location as Location;
};

const useCreateSeat = (
  blueprintId: string | number,
  locationId: string,
  options?: UseMutationOptions<Location | Partial<Location>, unknown, Payload>
) => {
  const queryClient = useQueryClient();

  return useMutation(payload => createSeat(blueprintId, payload), {
    onSuccess: async () => {
      await queryClient.invalidateQueries([GET_SEATS, blueprintId as string]);
      await queryClient.invalidateQueries([GET_SEAT_AMENITIES]);
      await queryClient.invalidateQueries([GET_CLIENT_LOCATION, locationId]);
    },
    ...options,
  });
};

export default useCreateSeat;
