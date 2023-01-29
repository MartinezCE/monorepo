import { api, useFileProgress } from '@wimet/apps-shared';
import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { GET_CLIENT_LOCATION } from './useGetClientLocation';

type Props = {
  floorId: string;
  data: FormData;
};

export const createBlueprint = async (
  { floorId, data }: Props,
  onUploadProgress?: (progressEvent: ProgressEvent) => void
) => {
  const { data: blueprint } = await api.post(`/floors/${floorId}/blueprints`, data, {
    onUploadProgress,
  });
  return blueprint;
};

export const useCreateBlueprint = (locationId: string, options?: UseMutationOptions<unknown, unknown, Props>) => {
  const queryClient = useQueryClient();
  const { handleProgress, progress, setProgress } = useFileProgress();

  return {
    ...useMutation((props: Props) => createBlueprint(props, handleProgress), {
      onSuccess: () => {
        setProgress(0);
        queryClient.invalidateQueries([GET_CLIENT_LOCATION, locationId]);
      },
      ...options,
    }),
    progress,
  };
};
