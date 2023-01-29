import { useQuery, UseQueryOptions } from 'react-query';
import { api, User } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

type Params = {
  selectedDate?: Date;
};

export const GET_BLUEPRINT_RESERVATIONS_USERS = 'GET_BLUEPRINT_RESERVATIONS_USERS';

export const getBlueprintReservationUsers = async (
  id: string | number,
  params: Params,
  headers?: AxiosRequestHeaders
) => {
  const { data: user } = await api.get<User[]>(`/blueprints/${id}/reservations-users`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
    params,
  });

  return user;
};

const useGetBlueprintReservationUsers = <T = User[]>(
  id: string | number,
  params: Params = {},
  options?: UseQueryOptions<User[], unknown, T, [typeof GET_BLUEPRINT_RESERVATIONS_USERS, typeof id, typeof params]>
) =>
  useQuery([GET_BLUEPRINT_RESERVATIONS_USERS, id, params], () => getBlueprintReservationUsers(id, params), {
    ...options,
  });

export default useGetBlueprintReservationUsers;
