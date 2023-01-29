import { api, User } from '@wimet/apps-shared';
import { useMutation, UseMutationOptions } from 'react-query';

export type LoginUserPayload = {
  email: string;
  password: string;
};

type Props = UseMutationOptions<unknown, unknown, LoginUserPayload>;

const loginUser = async (payload: LoginUserPayload) => {
  const { data: user } = await api.post<User>('auth/sign-in', payload);
  return user;
};

const useLoginUser = (queryOptions?: Props) => useMutation(loginUser, { ...queryOptions });

export default useLoginUser;
