import { QueryKey, useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { api, WPMReservationTypes, WPMReservation, pluralize } from '@wimet/apps-shared';
import { toast } from 'react-toastify';
import { GET_SEAT_WPM_RESERVATION } from './useGetSeatWPMReservation';

export type CreateWPMReservationPayload = {
  blueprintId: string | number;
  reservations: {
    seatId: number;
    typeId: WPMReservationTypes;
    startAt: Date;
    userId: number;
  }[];
};

export const createWPMReservations = async (payload?: CreateWPMReservationPayload) => {
  const { data: reservation } = await api.post<WPMReservation[]>('/seat-reservations', payload);
  return reservation;
};

const useCreateWPMReservations = (
  keyToInavlidate?: QueryKey,
  options?: UseMutationOptions<WPMReservation[], unknown, CreateWPMReservationPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation(createWPMReservations, {
    onSuccess: async (res, values) => {
      await Promise.all([
        queryClient.invalidateQueries(keyToInavlidate),
        ...values.reservations.map(r => queryClient.invalidateQueries([GET_SEAT_WPM_RESERVATION, r.seatId, r.startAt])),
      ]);
      toast.success(`${pluralize(res.length, 'Reservación')} creada con éxito`);
    },
    ...options,
  });
};

export default useCreateWPMReservations;
