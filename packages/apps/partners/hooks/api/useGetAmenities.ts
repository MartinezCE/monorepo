import { useQuery, UseQueryOptions } from 'react-query';
import QueryString from 'qs';
import { Amenity, AmenityType, api } from '@wimet/apps-shared';

export const GET_AMENITIES = 'GET_AMENITIES';

export type AmenitiesWithoutCustom = Exclude<AmenityType, 'CUSTOM'>;
export type AmenitiesResponse = {
  [k in AmenitiesWithoutCustom]?: Amenity[];
};

export const getAmenities = async (type?: AmenitiesWithoutCustom[]) => {
  const { data: amenities } = await api.get<Response>(
    '/amenities',
    type
      ? {
          params: { type },
          paramsSerializer: p => QueryString.stringify(p, { arrayFormat: 'repeat' }),
        }
      : undefined
  );

  return amenities;
};

const useGetAmenities = <T = Response>(
  type?: AmenitiesWithoutCustom[],
  options?: UseQueryOptions<Response, unknown, T, [typeof GET_AMENITIES, typeof type]>
) => useQuery([GET_AMENITIES, type], () => getAmenities(type), { ...options });

export default useGetAmenities;
