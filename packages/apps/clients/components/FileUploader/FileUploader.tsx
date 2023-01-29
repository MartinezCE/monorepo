/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { images } from '@wimet/apps-shared';
import { acceptedFileTypes, FileUploaderUseCases } from './types';

interface Event<T = EventTarget> {
  target: T;
}

export const FileUploaderWrapper = styled.div`
  width: 100%;
  max-width: 547px;
  padding: 20px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.white};
`;

const FileUploaderContainer = styled.div`
  width: 100%;
  max-width: 547px;

  & .dropzone-input-file {
    display: none;
  }
`;

export const FileUploaderDropzone = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  align-items: center;
  border: 0.1em dashed ${({ theme }) => theme.colors.darkGray};
  border-radius: 8px;
  min-height: 80px;
  padding: 2em 1em;
  cursor: pointer;
  width: 100%;
`;

const FileItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  column-gap: 6px;

  & .file-item-name {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.semiDarkGray};
  }

  & svg {
    color: ${({ theme }) => theme.colors.blue};
    transform: scale(0.8);
  }
`;

const DropzoneInfo = styled.div`
  display: flex;
  flex-direction: column;

  & .dropzone-info-text {
    color: ${({ theme }) => theme.colors.darkGray};
    font-size: 14px;
    font-weight: 300;
  }

  & .dropzone-info-plus-icon {
    color: ${({ theme }) => theme.colors.darkGray};

    svg {
      transform: scale(1.5);

      path {
        stroke-width: 1px;
      }
    }
  }

  & .dropzone-info-link {
    color: ${({ theme }) => theme.colors.blue};
    font-size: 14px;
    font-weight: 400;
  }
`;

const StyledError = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.darkRed};
`;

type FileUploaderProps = {
  children: React.ReactElement;
  useCase: FileUploaderUseCases;
  onChangeFiles: (files: File[]) => void;

  acceptedTypes?: String[];
  maxUpload?: number;
};

const FileUploader = ({ acceptedTypes, children, maxUpload = 1, useCase, onChangeFiles }: FileUploaderProps) => {
  const [allFiles, setAllFiles] = useState<File[]>([]);
  const [fileTypeError, setFileTypeError] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const enableAddFile = useMemo(() => !allFiles.length || allFiles.length < maxUpload, [allFiles]);
  const fileTypes = useMemo(() => acceptedTypes || acceptedFileTypes[useCase], []);

  const validateFileType = (acceptedFiles: String[], fileType: string): boolean => acceptedFiles.includes(fileType);

  const handlePreventEvent = (e: any) => e.preventDefault();

  const dropHandler = (e: React.DragEvent) => {
    e.preventDefault();

    if (!enableAddFile) return;

    const { files } = e.dataTransfer;

    if (inputRef.current === null) return;
    const uploadedFile = files[0];

    const isValidFile = validateFileType(fileTypes, uploadedFile.type);

    if (!isValidFile) {
      setFileTypeError('El formato del archivo no es válido');
      return;
    }

    inputRef.current.files = files;
    setFileTypeError('');
    setAllFiles(prev => {
      onChangeFiles([...prev, uploadedFile]);
      return [...prev, uploadedFile];
    });
  };

  const clickHandler = (e: any) => {
    e.preventDefault();

    if (!enableAddFile) return;

    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  };

  const changeHandler = (e: Event<HTMLInputElement>) => {
    const { files } = e.target;

    if (inputRef.current !== null && files !== null) {
      const uploadedFile = files[0];
      const isValidFile = validateFileType(fileTypes, uploadedFile.type);

      if (!isValidFile) {
        setFileTypeError('El formato del archivo no es válido');
        return;
      }

      inputRef.current.files = files;
      setAllFiles(prev => {
        onChangeFiles([...prev, uploadedFile]);
        return [...prev, uploadedFile];
      });
      setFileTypeError('');
    }
  };

  const removeHandler = (e: React.MouseEvent<HTMLElement>, index: number) => {
    e.stopPropagation();

    if (inputRef.current !== null) {
      inputRef.current.value = '';
      const updatedFiles = allFiles.filter((_, i) => i !== index);
      setAllFiles(updatedFiles);
      onChangeFiles(updatedFiles);
      setFileTypeError('');
    }
  };

  useEffect(() => {
    window.addEventListener('dragover', handlePreventEvent);
    window.addEventListener('drop', handlePreventEvent);

    return () => {
      window.removeEventListener('dragover', handlePreventEvent);
      window.removeEventListener('drop', handlePreventEvent);
    };
  }, []);

  return (
    <FileUploaderContainer>
      <FileUploaderDropzone onClick={clickHandler} onDrop={dropHandler} onDragOver={handlePreventEvent}>
        {enableAddFile && <DropzoneInfo>{children}</DropzoneInfo>}

        <FileItemContainer>
          {allFiles.map((file, i) => (
            <FileItem key={file.name} onClick={e => removeHandler(e, i)}>
              <span className='file-item-name'>{file.name}</span>
              <images.Close />
            </FileItem>
          ))}
        </FileItemContainer>

        {fileTypeError && <StyledError>{fileTypeError}</StyledError>}
      </FileUploaderDropzone>

      <input
        id='blueprint'
        type='file'
        name='blueprint'
        className='dropzone-input-file'
        ref={inputRef}
        accept={fileTypes.toString()}
        onChange={changeHandler}
      />
    </FileUploaderContainer>
  );
};

export default FileUploader;
