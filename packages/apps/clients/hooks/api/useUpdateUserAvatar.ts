import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { api, GET_ME, useFileProgress } from '@wimet/apps-shared';
import { toast } from 'react-toastify';

export type UpdateUserAvatarPayload = {
  userAvatar: FormData;
};

export const updateUserAvatar = async (
  payload: UpdateUserAvatarPayload,
  onUploadProgress?: (progressEvent: ProgressEvent) => void
) => {
  try {
    await api.patch('/user/avatar', payload, { onUploadProgress });
  } catch (e) {
    toast.error((e as Error).message);
  }
};

const useUpdateUserAvatar = (options?: UseMutationOptions<unknown, unknown, UpdateUserAvatarPayload>) => {
  const queryClient = useQueryClient();
  const { handleProgress, progress, setProgress } = useFileProgress();
  return {
    mutation: useMutation((payload: UpdateUserAvatarPayload) => updateUserAvatar(payload, handleProgress), {
      onSuccess: () => {
        setProgress(0);
        queryClient.invalidateQueries([GET_ME]);
      },
      ...options,
    }),
    progress,
  };
};

export default useUpdateUserAvatar;
