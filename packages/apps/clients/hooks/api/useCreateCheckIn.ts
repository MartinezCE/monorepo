import { useMutation, useQueryClient } from 'react-query';
import { api } from '@wimet/apps-shared';
import { toast } from 'react-toastify';
import { GET_RESERVATIONS } from './useGetReservations';

export const PUT_CANCEL = 'PUT_CANCEL';

export const cancelReservation = async (id: string) => {
  await api.put(`checkin/${id}/cancel`);
};

const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation((reservationId: string) => cancelReservation(reservationId), {
    onSuccess: () => {
      queryClient.invalidateQueries([GET_RESERVATIONS]);
      toast.success('Se cancelo correctamente la reserva.');
    },
  });
};
export default useCancelReservation;
