import { useQuery, UseQueryOptions } from 'react-query';
import { api, User } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

type Params = {
  selectedDate?: Date;
};

export const GET_RESERVATIONS_USERS = 'GET_RESERVATIONS_USERS';

export const getReservationUsers = async (params: Params, headers?: AxiosRequestHeaders) => {
  const { data: user } = await api.get<User[]>('/seat-reservations/users', {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
    params,
  });

  return user;
};

const useGetReservationUsers = <T = User[]>(
  params: Params = {},
  options?: UseQueryOptions<User[], unknown, T, [typeof GET_RESERVATIONS_USERS, typeof params]>
) => useQuery([GET_RESERVATIONS_USERS, params], () => getReservationUsers(params), options);

export default useGetReservationUsers;
