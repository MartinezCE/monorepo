import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { api, SpaceReservationHalfDayTypes, SpaceReservationHourlyTypes } from '@wimet/apps-shared';
import { GET_SPACE_DETAILS } from './useGetSpace';

type CreateSpaceReservationPayload = {
  spaceId: string | number;
  monthly?: { fromDate: Date; monthsQuantity: number };
  hourly?: {
    day: Date;
    hourlyId: number;
    type: SpaceReservationHourlyTypes;
    perHour?: { start: Date; end: Date };
    halfDay?: SpaceReservationHalfDayTypes;
  }[];
};

export const createSpaceReservation = async (payload: CreateSpaceReservationPayload) => {
  const { data: reservation } = await api.post('/space-reservations', payload);
  return reservation;
};

const useCreateSpaceReservation = (
  spaceId: string | number,
  options?: UseMutationOptions<Partial<CreateSpaceReservationPayload>, unknown, CreateSpaceReservationPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation(createSpaceReservation, {
    onSuccess: () => {
      queryClient.invalidateQueries([GET_SPACE_DETAILS, spaceId as string]);
    },
    ...options,
  });
};

export default useCreateSpaceReservation;
