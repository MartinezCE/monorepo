import { api, User } from '@wimet/apps-shared';
import { useMutation, UseMutationOptions } from 'react-query';

export type PasswordRecoveryPayload = {
  email: string;
};

type Props = UseMutationOptions<unknown, unknown, PasswordRecoveryPayload>;

const passwordRecovery = async (payload: PasswordRecoveryPayload) => {
  await api.post<User>('auth/password-recovery', payload);
};

const usePasswordRecovery = (queryOptions?: Props) => useMutation(passwordRecovery, { ...queryOptions });

export default usePasswordRecovery;
