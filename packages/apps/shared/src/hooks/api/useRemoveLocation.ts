import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { api } from '../../api';

type Props = {
  id: number;
  queryToInvalidate: string;
};

export const removeLocation = async ({ id }: Props) => {
  try {
    await api.delete(`/locations/${id}`);
  } catch (e) {
    toast.error((e as Error).message);
  }
};

export const useRemoveLocation = (options?: UseMutationOptions<unknown, unknown, Props>) => {
  const queryClient = useQueryClient();

  return useMutation(removeLocation, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(variables.queryToInvalidate);
    },
    ...options,
  });
};
