import { ErrorCode } from 'react-dropzone';

export type FileTypes = 'img' | 'doc';
export type DropzoneErrorByFileType = Record<FileTypes, string>;
export type DropZoneErrors = {
  [k in ErrorCode]?: string | DropzoneErrorByFileType;
};

export const dropzoneErrors: DropZoneErrors = {
  'file-invalid-type': {
    img: 'El archivo debe ser una imagen .jpg o .png',
    doc: 'El archivo debe ser un documento .pdf o .doc',
  },
  'file-too-large': 'El archivo debe ser de 4MB como máximo.',
  'too-many-files': 'Solo se permiten 10 archivos como máximo.',
};
