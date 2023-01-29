import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { api, Seat, SeatGoogle } from '@wimet/apps-shared';

export const GET_SYNCGOOGLE = 'GET_SYNCGOOGLE';

type NewSeatsParam = {
  resourceIds: string[];
};

export const getSyncGoogle = async (headers?: AxiosRequestHeaders) => {
  const { data: seats } = await api.get('/seat-reservations/integrate/google/resources', {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });
  return seats;
};

export const createSeat = async (newSeats: NewSeatsParam) => {
  const { data: seats } = await api.post('/seat-reservations/integrate/google/resources', newSeats);
  return seats;
};

export const useGetSyncGoogle = <T = SeatGoogle[]>(
  options?: UseQueryOptions<SeatGoogle[], unknown, T, typeof GET_SYNCGOOGLE>
) => useQuery(GET_SYNCGOOGLE, () => getSyncGoogle(), options);

export const useCreateSeat = (options?: UseMutationOptions<Seat | Partial<Seat>, unknown, NewSeatsParam>) =>
  useMutation(createSeat, options);
