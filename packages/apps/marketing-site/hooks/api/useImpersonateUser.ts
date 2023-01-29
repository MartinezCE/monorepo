import { useQuery, UseQueryOptions } from 'react-query';
import { api, User } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';

export const IMPERSONATE_USER = 'IMPERSONATE_USER';

export const impersonateUser = async (userId: string, headers?: AxiosRequestHeaders) => {
  const { data: user } = await api.post<User>(`/impersonate/${userId}`, {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });
  return user;
};

const useImpersonateUser = (
  userId: string,
  options?: UseQueryOptions<User, unknown, User, [typeof IMPERSONATE_USER, typeof userId]>
) => useQuery([IMPERSONATE_USER, userId], () => impersonateUser(userId), options);

export default useImpersonateUser;
