import { useQuery, UseQueryOptions } from 'react-query';
import { api, Seat } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';
import { useMemo } from 'react';

export const GET_SEATS = 'GET_SEATS';

type Params = {
  selectedDate?: Date;
  includeAmenities?: boolean;
  includeReservations?: boolean;
};

export const getSeats = async (
  blueprintId: string | number,
  params: Params,
  headers?: AxiosRequestHeaders,
  signal?: AbortSignal
) => {
  const { data: location } = await api.get<Seat[]>(`/blueprints/${blueprintId}/seats`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
    params,
    signal,
  });
  return location;
};

export const useGetSeats = (
  blueprintId: string | number,
  params: Params = {},
  options?: UseQueryOptions<Seat[], unknown, Seat[], [typeof GET_SEATS, typeof blueprintId, typeof params]>
) =>
  useQuery([GET_SEATS, blueprintId, params], ({ signal }) => getSeats(blueprintId, params, undefined, signal), {
    staleTime: 0,
    ...options,
  });

export const useGetSeatsWithoutPoint = (seats: Seat[] | null) => {
  const filteredSeats = useMemo(() => {
    const dataFilter = seats?.filter(s => !s.geometry);
    return dataFilter?.map(s => ({ value: s.id, label: s.name })) || [];
  }, [seats]);

  return filteredSeats;
};
