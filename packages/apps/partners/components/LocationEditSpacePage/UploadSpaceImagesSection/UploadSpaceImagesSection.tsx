import { UploadImagesSection, useDropzoneErrorMessage } from '@wimet/apps-shared';
import { useFormikContext } from 'formik';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useGetSpace from '../../../hooks/api/useGetSpace';
import useHandleUploadSpaceFiles from '../../../hooks/useHandleUploadSpaceFiles';
import type { EditSpaceInitialValues } from '../../../pages/locations/[locationId]/spaces/[spaceId]/edit';

type Props = {
  description: string;
};

export default function UploadSpaceImagesSection({ description }: Props) {
  const { query } = useRouter();
  const { data: spaceData = {} } = useGetSpace(query.spaceId as string);
  const { errors, setFieldValue, touched } = useFormikContext<EditSpaceInitialValues>();

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    files,
    handleRemove,
    isRemovingFile,
    error,
    isLoading,
    progress,
  } = useHandleUploadSpaceFiles({
    files: spaceData.spaceFiles?.images || [],
    type: 'IMAGE',
    maxSize: 4194304,
    maxFiles: 10,
    accept: 'image/jpeg,image/png',
    multiple: true,
    fieldName: 'spaceFiles',
  });

  const errorMessage = useDropzoneErrorMessage({
    fileType: 'img',
    showError: !!error || !!(files.length && touched.imageQuantity),
    error,
    formikError: errors.imageQuantity,
  });

  useEffect(() => {
    if (!files.length && !touched.imageQuantity) return;
    setFieldValue('imageQuantity', files.length);
  }, [files.length, touched.imageQuantity]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <UploadImagesSection
      description={description}
      getRootProps={getRootProps}
      getInputProps={getInputProps}
      isDragActive={isDragActive}
      isDragReject={isDragReject}
      files={files}
      handleRemove={handleRemove}
      isRemovingFile={isRemovingFile}
      isError={!!errorMessage}
      isLoading={isLoading}
      progress={progress}
      draggableErrorText='el archivo debe ser una imagen .jpg o .png de 4MB como máximo.'
      errorText={errorMessage}
    />
  );
}
