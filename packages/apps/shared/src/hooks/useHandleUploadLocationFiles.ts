import { useRouter } from 'next/router';
import { LocationFile } from '../types/api';
import { useRemoveFiles, useUploadFiles } from './api';
import useDropZoneFiles, { CustomFile, UseDropZoneFilesProps } from './useDropZoneFiles';

interface Props extends Omit<UseDropZoneFilesProps, 'onPostFiles'> {
  files: LocationFile[];
  type: 'DOCUMENT' | 'IMAGE';
  queryToInvalidate: string;
}

const useHandleUploadLocationFiles = ({ files, type, queryToInvalidate, ...options }: Props) => {
  const {
    mutation: { mutateAsync: uploadFiles, isLoading, isError },
    progress,
  } = useUploadFiles();
  const router = useRouter();
  const { locationId } = router.query;

  const { ...upload } = useDropZoneFiles({
    ...options,
    files,
    onPostFiles: data => {
      uploadFiles({
        id: locationId as string,
        data,
        type,
        modelURL: 'locations',
        queryToInvalidate,
      });
    },
  });
  const { mutateAsync: removeFile, isLoading: isRemovingFile } = useRemoveFiles();

  const handleRemove = (file?: Partial<CustomFile>) =>
    removeFile({
      id: locationId as string,
      fileId: file?.id as number,
      modelURL: 'locations',
      queryToInvalidate,
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

export default useHandleUploadLocationFiles;
