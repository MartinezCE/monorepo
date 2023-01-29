import { useQuery, UseQueryOptions } from 'react-query';
import { api } from '../../api';
import { SpaceTypeEnum } from '../../utils';

type SpaceData = { id: string; value: SpaceTypeEnum }[];

export const GET_SPACE_TYPE = 'GET_SPACE_TYPE';

export const getSpaceType = async (reservationId: number) => {
  const data: SpaceData = await api.get(`/space-reservations/types/${reservationId}/space-types`).then(r => r.data);
  return data;
};

export const useGetSpaceType = (
  reservationId: number,
  queryOptions?: UseQueryOptions<SpaceData, unknown, SpaceData, (string | number)[]>
) => useQuery([GET_SPACE_TYPE, reservationId], () => getSpaceType(reservationId), { ...queryOptions });
