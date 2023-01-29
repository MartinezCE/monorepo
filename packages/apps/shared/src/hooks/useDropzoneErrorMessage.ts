import { useMemo } from 'react';
import { ErrorCode } from 'react-dropzone';
import { DropzoneErrorByFileType, dropzoneErrors, FileTypes } from '../utils/dropzone';

const useDropzoneErrorMessage = ({
  fileType,
  showError,
  error,
  formikError,
}: {
  fileType: FileTypes;
  showError: boolean;
  error?: ErrorCode | null;
  formikError?: string;
}) =>
  useMemo(() => {
    if (!showError) return '';
    if (error) {
      if (typeof dropzoneErrors[error] === 'string') return dropzoneErrors[error] as string;
      return (dropzoneErrors[error] as DropzoneErrorByFileType)?.[fileType];
    }
    if (formikError) return formikError;
    return '';
  }, [showError, error, formikError, fileType]);

export default useDropzoneErrorMessage;
