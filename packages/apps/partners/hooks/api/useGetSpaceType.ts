import { useQuery, UseQueryOptions } from 'react-query';
import { api } from '@wimet/apps-shared';

type SpaceData = { id: string; value: string }[];

export const GET_SPACE_TYPE = 'GET_SPACE_TYPE';

export const getSpaceType = async (reservationId: number) => {
  const data: SpaceData = await api.get(`/space-reservations/types/${reservationId}/space-types`).then(r => r.data);
  return data;
};

const useGetSpaceType = (
  reservationId: number,
  queryOptions?: UseQueryOptions<SpaceData, unknown, SpaceData, (string | number)[]>
) => useQuery([GET_SPACE_TYPE, reservationId], () => getSpaceType(reservationId), { ...queryOptions });

export default useGetSpaceType;
