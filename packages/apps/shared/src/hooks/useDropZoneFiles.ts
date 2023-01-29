/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useState } from 'react';
import { DropzoneOptions, ErrorCode, useDropzone } from 'react-dropzone';
import { LocationFile, SpaceFile } from '../types/api';

export type CustomFile = { name: string; preview: string; id?: number };

export interface UseDropZoneFilesProps extends DropzoneOptions {
  fieldName?: string;
  onPostFiles: (data: FormData) => void;
  files?: (LocationFile | SpaceFile)[];
}

const useDropZoneFiles = (options: UseDropZoneFilesProps) => {
  const files = useMemo(
    () =>
      (options.files || [])?.map(f => ({
        name: f.name,
        preview: f.url,
        id: f.id,
      })) as CustomFile[],
    [options.files]
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<ErrorCode | null>(null);

  const dropzone = useDropzone({
    ...options,
    maxFiles: undefined,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      let errorCode: ErrorCode | null = null;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        setError(null);
      }

      if (rejectedFiles.length) errorCode = rejectedFiles[0].errors[0].code as ErrorCode;
      if (!errorCode && options.maxFiles && files.length + 1 > options.maxFiles) errorCode = ErrorCode.TooManyFiles;

      if (errorCode) {
        setError(errorCode);
        timerRef.current = setTimeout(() => setError(null), 2000);
        return;
      }

      const data = new FormData();
      acceptedFiles
        .slice(0, options.maxFiles && options.maxFiles - files.length)
        .forEach(f => data.append(options.fieldName || 'files', f));
      options.onPostFiles(data);
    },
  });

  return {
    ...dropzone,
    error,
    files,
  };
};

export default useDropZoneFiles;
