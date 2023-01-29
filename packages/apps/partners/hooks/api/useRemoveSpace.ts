import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { api } from '@wimet/apps-shared';

type Props = {
  id: number;
  queryToInvalidate: string;
};

export const removeSpace = async ({ id }: Props) => {
  try {
    await api.delete(`/spaces/${id}`);
  } catch (e) {
    toast.error((e as Error).message);
  }
};

const useRemoveSpace = (options?: UseMutationOptions<unknown, unknown, Props>) => {
  const queryClient = useQueryClient();

  return useMutation(removeSpace, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(variables.queryToInvalidate);
    },
    ...options,
  });
};

export default useRemoveSpace;
