import { api } from '@wimet/apps-shared';
import { useMutation, UseMutationOptions } from 'react-query';

export type CreateUserPayload = {
  company?: { name: string; companyTypeId: number; country: number; stateId: number };
  firstName?: string;
  lastName?: string;
  password?: string;
  phoneNumber?: string;
  email?: string;
  token?: string;
};

type Scopes = 'partners' | 'clients';

const createUser = async (scope: Scopes, payload: CreateUserPayload) => {
  const { data: user } = await api.post(`auth/sign-up/${scope}`, payload);
  return user;
};

const useCreateUser = <T extends CreateUserPayload>(
  scope: Scopes,
  queryOptions?: UseMutationOptions<unknown, unknown, T>
) => useMutation(payload => createUser(scope, payload), queryOptions);

export default useCreateUser;
