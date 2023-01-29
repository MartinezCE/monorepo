import { api, User } from '@wimet/apps-shared';
import { useMutation, UseMutationOptions } from 'react-query';

export type ResetPasswordPayload = {
  password: string;
  passwordRepeat: string;
  token: string;
};

type Props = UseMutationOptions<unknown, unknown, ResetPasswordPayload>;

const resetPassword = async (payload: ResetPasswordPayload) => {
  const { data: user } = await api.post<User>('auth/password-recovery/confirm', payload);
  return user;
};

const useResetPassword = (queryOptions?: Props) => useMutation(resetPassword, { ...queryOptions });

export default useResetPassword;
