import { DocumentPreview, DropZone } from '@wimet/apps-shared';
import React from 'react';
import { useDropzone } from 'react-dropzone';

type Props = {
  files: File[];
  onDropAccepted: (files: File[]) => void;
  handleRemove?: (file?: Partial<File>) => Promise<unknown>;
};

const UploadFileSection = ({ files, onDropAccepted, handleRemove }: Props) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDropAccepted,
    accept: 'text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    maxFiles: 1,
    multiple: false,
  });

  return (
    <DropZone
      maxFiles={1}
      files={files}
      draggableErrorText='sólo se permite 1 archivo de tipo .xls ó .xlsx'
      draggableText='Agregar o arrastrar archivo .xls ó .xlsx'
      getRootProps={getRootProps}
      getInputProps={getInputProps}
      isDragActive={isDragActive}
      isDragReject={isDragReject}
      handleRemove={handleRemove}
      getPreview={file => <DocumentPreview name={file?.name} withBorder />}
      hideRemoveModal
    />
  );
};

export default UploadFileSection;
