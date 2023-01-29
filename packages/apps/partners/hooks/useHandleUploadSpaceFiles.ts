import {
  CustomFile,
  SpaceFile,
  useDropZoneFiles,
  UseDropZoneFilesProps,
  useRemoveFiles,
  useUploadFiles,
} from '@wimet/apps-shared';
import { useRouter } from 'next/router';
import { DropzoneState, ErrorCode } from 'react-dropzone';
import { GET_SPACE } from './api/useGetSpace';

interface Props extends Omit<UseDropZoneFilesProps, 'onPostFiles'> {
  files: SpaceFile[];
  type: 'DOCUMENT' | 'IMAGE';
}

const useHandleUploadSpaceFiles = ({ files, type, ...options }: Props) => {
  const {
    mutation: { mutateAsync: uploadFiles, isLoading, isError },
    progress,
  } = useUploadFiles();
  const router = useRouter();
  const { spaceId } = router.query;

  const { ...upload } = useDropZoneFiles({
    ...options,
    files,
    onPostFiles: data => {
      uploadFiles({
        id: spaceId as string,
        data,
        type,
        modelURL: 'spaces',
        queryToInvalidate: GET_SPACE,
      });
    },
  }) as { error: ErrorCode; files: CustomFile[] } & DropzoneState;
  const { mutateAsync: removeFile, isLoading: isRemovingFile } = useRemoveFiles();

  const handleRemove = (file?: Partial<CustomFile>) =>
    removeFile({
      id: spaceId as string,
      fileId: file?.id as number,
      modelURL: 'spaces',
      queryToInvalidate: GET_SPACE,
    });

  return {
    ...upload,
    upload,
    isLoading,
    isError,
    handleRemove,
    isRemovingFile,
    progress,
  };
};

export default useHandleUploadSpaceFiles;
