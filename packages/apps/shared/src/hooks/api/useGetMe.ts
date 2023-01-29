import { useQuery, UseQueryOptions } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { api } from '../../api';
import { User } from '../../types/api';

export const GET_ME = 'GET_ME';

export const getMe = async (headers?: AxiosRequestHeaders) => {
  const { data: user } = await api.get<User>('/user/me', {
    headers: headers?.cookie ? { cookie: headers?.cookie } : undefined,
  });
  return user;
};

export const useGetMe = <T = User>(options?: UseQueryOptions<User, unknown, T, typeof GET_ME>) =>
  useQuery(GET_ME, () => getMe(), options);
