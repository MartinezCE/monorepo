import { api, useFileProgress } from '@wimet/apps-shared';
import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { GET_ALL_CLIENT_LOCATIONS } from './useGetAllClientLocations';
import { GET_CLIENT_LOCATION } from './useGetClientLocation';

type Props = {
  blueprintId: number;
  data: FormData;
};

export const updateBlueprint = async (
  { blueprintId, data }: Props,
  onUploadProgress?: (progressEvent: ProgressEvent) => void
) => {
  try {
    await api.patch(`/blueprints/${blueprintId}`, data, {
      onUploadProgress,
    });
  } catch (e) {
    toast.error((e as Error).message);
  }
};

export const useUpdateBlueprint = (locationId: string, options?: UseMutationOptions<unknown, unknown, Props>) => {
  const queryClient = useQueryClient();
  const { handleProgress, progress, setProgress } = useFileProgress();

  return {
    ...useMutation((props: Props) => updateBlueprint(props, handleProgress), {
      onSuccess: async () => {
        await queryClient.invalidateQueries([GET_CLIENT_LOCATION, locationId]);
        await queryClient.invalidateQueries([GET_ALL_CLIENT_LOCATIONS]);
        setProgress(0);
      },
      ...options,
    }),
    progress,
  };
};

export default useUpdateBlueprint;
