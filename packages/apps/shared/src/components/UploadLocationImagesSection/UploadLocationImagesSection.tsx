/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormikContext } from 'formik';
import { useEffect } from 'react';
import useDropzoneErrorMessage from '../../hooks/useDropzoneErrorMessage';
import useHandleUploadLocationFiles from '../../hooks/useHandleUploadLocationFiles';
import { LocationFile } from '../../types';
import UploadImagesSection from '../UploadImagesSection';

type Props = {
  description: string;
  images: LocationFile[];
  queryToInvalidate: string;
};

export default function UploadLocationImagesSection({ description, images, queryToInvalidate }: Props) {
  const { errors, setFieldValue, touched } = useFormikContext<any>();

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
  } = useHandleUploadLocationFiles({
    queryToInvalidate,
    files: images,
    type: 'IMAGE',
    maxSize: 4194304,
    maxFiles: 10,
    accept: 'image/jpeg,image/png',
    multiple: true,
    fieldName: 'locationFiles',
  });

  const errorMessage = useDropzoneErrorMessage({
    fileType: 'img',
    showError: !!error || !!(files.length && touched.imageQuantity),
    error,
    formikError: errors.imageQuantity as string,
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
