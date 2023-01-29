import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { api } from '../../api';
import useFileProgress from '../useFileProgress';

type Props = {
  id: string;
  data: FormData;
  type: 'DOCUMENT' | 'IMAGE';
  modelURL: 'locations' | 'spaces';
  queryToInvalidate: string;
};

export const uploadFiles = async (
  { id, data, type, modelURL }: Props,
  onUploadProgress?: (progressEvent: ProgressEvent) => void
) => {
  try {
    await api.post(`/${modelURL}/${id}/files`, data, {
      params: {
        type,
      },
      onUploadProgress,
    });
  } catch (e) {
    toast.error((e as Error).message);
  }
};

export const useUploadFiles = (options?: UseMutationOptions<unknown, unknown, Props>) => {
  const queryClient = useQueryClient();
  const { handleProgress, progress, setProgress } = useFileProgress();

  return {
    mutation: useMutation((props: Props) => uploadFiles(props, handleProgress), {
      onSuccess: (_, variables) => {
        setProgress(0);
        queryClient.invalidateQueries([variables.queryToInvalidate, variables.id]);
      },
      ...options,
    }),
    progress,
  };
};
