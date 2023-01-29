import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { api } from '../../api';

type Props = {
  id: string;
  fileId: string | number;
  modelURL: 'locations' | 'spaces';
  queryToInvalidate: string;
};

export const removeFiles = async ({ id, fileId, modelURL }: Props) => {
  try {
    await api.delete(`/${modelURL}/${id}/files/${fileId}`);
  } catch (e) {
    toast.error((e as Error).message);
  }
};

export const useRemoveFiles = (options?: UseMutationOptions<void, unknown, Props>) => {
  const queryClient = useQueryClient();

  return useMutation(removeFiles, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries([variables.queryToInvalidate, variables.id]);
    },
    ...options,
  });
};
