import { useQuery, UseQueryOptions } from 'react-query';
import { api, Space } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_SPACE = 'GET_SPACE';

export const getSpace = async (id?: string, headers?: AxiosRequestHeaders) => {
  if (!id) return {} as Partial<Space>;
  const space: Space = await api
    .get(`/spaces/${id}`, { headers: headers?.cookie ? { cookie: headers?.cookie } : undefined })
    .then(r => r.data);
  return space;
};

const useGetSpace = <T = Space | Partial<Space>>(
  id: string,
  options?: UseQueryOptions<Space | Partial<Space>, unknown, T, [typeof GET_SPACE, typeof id]>
) => useQuery([GET_SPACE, id], () => getSpace(id), { ...options });

export default useGetSpace;
