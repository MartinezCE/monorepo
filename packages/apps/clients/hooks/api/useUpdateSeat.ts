import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { api, Seat } from '@wimet/apps-shared';
import { GET_SEATS } from './useGetSeats';
import { GET_CLIENT_LOCATION } from './useGetClientLocation';

type Params = { seatId: string | number; payload?: Omit<Partial<Seat>, 'amenities'> & { amenities: number[] } };

export const updateSeat = async ({ seatId, payload }: Params) => {
  const { data: seat } = await api.patch(`/seats/${seatId}`, payload);
  return seat;
};

const useUpdateSeat = (locationId: string, options?: UseMutationOptions<Partial<Seat>, unknown, Params>) => {
  const queryClient = useQueryClient();

  return useMutation(updateSeat, {
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries([GET_SEATS]),
        queryClient.invalidateQueries([GET_CLIENT_LOCATION, locationId]),
      ]);
    },
    ...options,
  });
};

export default useUpdateSeat;
