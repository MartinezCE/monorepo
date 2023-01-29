import { useQuery, UseQueryOptions } from 'react-query';
import { api, HourlySpaceReservation } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_RESERVATIONS = 'GET_RESERVATIONS';

export const getReservations = async (
  companyId: string | number,
  offset?: number,
  limit?: number,
  headers?: AxiosRequestHeaders
) => {
  const { data } = await api.get<HourlySpaceReservation[]>(
    `/companies/${companyId}/reservations?offset=${offset}&limit=${limit}`,
    {
      headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
    }
  );
  return data;
};

const useGetReservations = <T = HourlySpaceReservation[]>(
  companyId: string | number,
  offset?: number,
  limit?: number,
  queryOptions?: UseQueryOptions<HourlySpaceReservation[], unknown, T, [typeof GET_RESERVATIONS, typeof companyId]>
) =>
  useQuery([GET_RESERVATIONS, companyId], () => getReservations(companyId, offset, limit), {
    staleTime: 0,
    ...queryOptions,
  });

export default useGetReservations;
