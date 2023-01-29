import { BlueprintFile, CustomFile } from '@wimet/apps-shared';
import { useFormikContext } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import { DropzoneOptions, ErrorCode, useDropzone } from 'react-dropzone';

export interface UseDropZoneFilesProps extends DropzoneOptions {
  fieldName?: string;
  onPostFiles: (data: FormData) => void;
  files?: BlueprintFile[];
}

interface Props extends Omit<UseDropZoneFilesProps, 'onPostFiles'> {
  files: BlueprintFile[];
  type: 'IMAGE';
}

const useHandleUploadBlueprintFiles = ({ files, type, ...options }: Props) => {
  const { setFieldValue } = useFormikContext();
  const [previewPaths, setPreviewPaths] = useState([]);
  const [error, setError] = useState<ErrorCode | null>(null);

  const removeFile = () => {
    setPreviewPaths([]);
    setError(null);
    setFieldValue(options.fieldName || '', []);
  };

  const onDrop = useCallback(
    async (acceptedFiles, rejectedFiles) => {
      let errorCode: ErrorCode | null = null;

      if (rejectedFiles.length) errorCode = rejectedFiles[0].errors[0].code as ErrorCode;

      if (errorCode) {
        setError(errorCode);
        return;
      }

      setPreviewPaths(acceptedFiles.map((f: Blob) => URL.createObjectURL(f)));
      setFieldValue(options.fieldName || '', acceptedFiles);
    },
    [setFieldValue, options.fieldName]
  );

  const filesToUpload = useMemo(
    () =>
      (files || [])?.map(f => ({
        name: f.name,
        preview: f.url,
        id: f.id,
      })) as CustomFile[],
    [files]
  );
  const dropzone = useDropzone({
    ...options,
    maxFiles: 1,
    onDrop,
  });

  return {
    ...dropzone,
    filesToUpload,
    previewPaths,
    error,
    removeFile,
  };
};

export default useHandleUploadBlueprintFiles;
