import { useQuery } from 'react-query';
import { api, Space } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const GET_SPACE_DETAILS = 'GET_SPACE_DETAILS';

export const getSpace = async (id: string, headers?: AxiosRequestHeaders) => {
  const space: Space = await api
    .get(`/spaces/${id}`, { headers: headers?.cookie ? { cookie: headers?.cookie } : undefined })
    .then(r => r.data);
  return space;
};

const useGetSpace = (id: string) => useQuery([GET_SPACE_DETAILS, id], () => getSpace(id));

export default useGetSpace;
