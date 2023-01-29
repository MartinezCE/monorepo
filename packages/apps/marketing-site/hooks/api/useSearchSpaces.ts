import { api, LocationStatus, Location } from '@wimet/apps-shared';
import { useQuery, UseQueryOptions } from 'react-query';

export const SEARCH_SPACES = 'SEARCH_SPACES';

export type SearchSpacesPayload = {
  center?: { lat: number; lng: number };
  radius?: number;
  spaceTypeId?: number | number[];
  spaceReservationTypeId?: number;
};

const searchSpaces = async (payload?: SearchSpacesPayload, signal?: AbortSignal) => {
  if (!payload) return [];
  const { center, radius, spaceTypeId, spaceReservationTypeId } = payload;
  const { data: spaces } = await api.get<Location[]>('search/spaces', {
    signal,
    params: {
      lat: center?.lat,
      lng: center?.lng,
      radius,
      spaceTypeId,
      spaceReservationTypeId,
      status: LocationStatus.PUBLISHED,
    },
  });
  return spaces;
};

const useSearchSpaces = (
  payload?: SearchSpacesPayload,
  options?: UseQueryOptions<Location[], unknown, Location[], [typeof SEARCH_SPACES, typeof payload]>
) => useQuery([SEARCH_SPACES, payload], ({ signal }) => searchSpaces(payload, signal), { ...options });

export default useSearchSpaces;
