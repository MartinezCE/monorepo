import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { api, Seat } from '@wimet/apps-shared';
import { GET_SEATS } from './useGetSeats';
import { GET_CLIENT_LOCATION } from './useGetClientLocation';

type Params = { seatId: string | number };

export const deleteSeat = async ({ seatId }: Params) => {
  const { data: seat } = await api.delete(`/seats/${seatId}`);
  return seat;
};

const useDeleteSeat = (locationId: string, options?: UseMutationOptions<Partial<Seat>, unknown, Params>) => {
  const queryClient = useQueryClient();

  return useMutation(deleteSeat, {
    onSuccess: async () => {
      await queryClient.invalidateQueries([GET_SEATS]);
      await queryClient.invalidateQueries([GET_CLIENT_LOCATION, locationId]);
    },
    ...options,
  });
};

export default useDeleteSeat;
