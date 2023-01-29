import { CustomFile, useDropZoneFiles, UseDropZoneFilesProps } from '@wimet/apps-shared';
import { useRouter } from 'next/router';
import { DropzoneState, ErrorCode } from 'react-dropzone';
import { useCreateBlueprint } from './api/useCreateBlueprint';
import useDeleteBlueprint from './api/useDeleteBlueprint';

interface Props extends Omit<UseDropZoneFilesProps, 'onPostFiles'> {
  floorId: string;
}

const useHandleBlueprints = ({ floorId, ...options }: Props) => {
  const router = useRouter();
  const {
    progress,
    mutateAsync: createBlueprint,
    isLoading,
    isError,
  } = useCreateBlueprint(router.query.locationId as string);

  const { ...upload } = useDropZoneFiles({
    ...options,
    files: [],
    onPostFiles: data => {
      createBlueprint({
        data,
        floorId,
      });
    },
  }) as { error: ErrorCode; files: CustomFile[] } & DropzoneState;

  const { mutateAsync: removeFile, isLoading: isRemovingFile } = useDeleteBlueprint(router.query.locationId as string);

  const handleRemove = (id: number) => removeFile(id);

  return {
    ...upload,
    upload,
    isLoading,
    isError,
    progress,
    handleRemove,
    isRemovingFile,
  };
};

export default useHandleBlueprints;
