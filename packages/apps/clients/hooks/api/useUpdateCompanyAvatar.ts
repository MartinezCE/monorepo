import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { api, GET_ME, useFileProgress } from '@wimet/apps-shared';
import { toast } from 'react-toastify';

export type UpdateCompanyAvatarPayload = {
  companyAvatar: FormData;
};

export const updateCompanyAvatar = async (
  companyId: number,
  payload: UpdateCompanyAvatarPayload,
  onUploadProgress?: (progressEvent: ProgressEvent) => void
) => {
  try {
    await api.patch(`/companies/${companyId}/avatar`, payload, { onUploadProgress });
  } catch (e) {
    toast.error((e as Error).message);
  }
};

const useUpdateCompanyAvatar = (
  companyId: number,
  options?: UseMutationOptions<unknown, unknown, UpdateCompanyAvatarPayload>
) => {
  const queryClient = useQueryClient();
  const { handleProgress, progress, setProgress } = useFileProgress();
  return {
    mutation: useMutation(
      (payload: UpdateCompanyAvatarPayload) => updateCompanyAvatar(companyId, payload, handleProgress),
      {
        onSuccess: () => {
          setProgress(0);
          queryClient.invalidateQueries([GET_ME]);
        },
        ...options,
      }
    ),
    progress,
  };
};

export default useUpdateCompanyAvatar;
