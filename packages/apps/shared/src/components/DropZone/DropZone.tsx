import styled, { css, useTheme } from 'styled-components';
import { DropzoneRootProps } from 'react-dropzone';

import CircularProgressBar from '../CircularProgressBar';
import { images } from '../../assets';
import Label from '../Label';
import DropzonePreview from '../DropzonePreview';
import { CustomFile } from '../../hooks';

const StyledWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
`;

type StyledDropzoneProps = {
  isDragActive?: boolean;
  isDragReject?: boolean;
  isLoading?: boolean;
};

const StyledDropzone = styled.div<StyledDropzoneProps>`
  margin-top: auto;
  padding: 18px 16px;
  color: ${({ theme }) => theme.colors.darkGray};
  background-color: ${({ theme }) => theme.colors.white};
  border: 2px dashed ${({ theme }) => theme.colors.darkGray};
  border-radius: 4px;
  text-align: center;
  display: flex;
  flex-direction: column;
  row-gap: 6px;
  justify-content: center;
  align-items: center;
  width: 179px;
  height: 112px;
  overflow: hidden;
  transition: border 0.2s ease-in-out, color 0.2s ease-in-out, background-color 0.2s ease-in-out;
  cursor: pointer;

  ${({ isDragActive, isDragReject }) =>
    !isDragActive &&
    !isDragReject &&
    css`
      &:hover {
        border: 2px dashed ${({ theme }) => theme.colors.blue};
        color: ${({ theme }) => theme.colors.blue};
      }
    `}

  ${({ isDragActive, isLoading }) =>
    (isDragActive || isLoading) &&
    css`
      border: 2px dashed ${({ theme }) => theme.colors.blue};
      color: ${({ theme }) => theme.colors.blue};
      background-color: ${({ theme }) => theme.colors.extraLightBlue};
    `}

    ${({ isDragReject, isLoading }) =>
    isDragReject &&
    !isLoading &&
    css`
      border: 2px dashed ${({ theme }) => theme.colors.error};
      background-color: transparent;
      color: ${({ theme }) => theme.colors.error};
    `}


    ${({ isLoading }) =>
    isLoading &&
    css`
      pointer-events: none;
    `}
`;

const StyledLabel = styled(Label)`
  font-weight: ${({ theme }) => theme.fontWeight[0]};
`;

const StyledImageClose = styled(images.Close)`
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StyledProgressWrapper = styled.div`
  width: 39px;
  height: 39px;
`;

interface Props<T> extends DropzoneRootProps {
  draggableText: string;
  draggableErrorText: string;
  maxFiles?: number;
  files?: Partial<T>[];
  handleRemove?: (file?: Partial<T>) => Promise<unknown>;
  hideRemoveModal?: boolean;
  isLoading?: boolean;
  uploadingProgress?: number;
  getPreview?: (file?: Partial<T>) => React.ReactNode;
  className?: string;
  isRemovingFile?: boolean;
}

export default function DropZone<T extends File & CustomFile>({
  maxFiles,
  draggableText,
  draggableErrorText,
  getRootProps,
  getInputProps,
  isDragActive,
  isDragReject,
  files = [],
  handleRemove,
  hideRemoveModal,
  isRemovingFile,
  getPreview,
  isLoading,
  uploadingProgress,
  className,
}: Props<T>) {
  const theme = useTheme();

  return (
    <StyledWrapper className={className}>
      {files.map(file => (
        <DropzonePreview
          key={file?.id || file.name}
          getPreview={getPreview}
          handleRemove={handleRemove}
          hideRemoveModal={hideRemoveModal}
          isRemovingFile={isRemovingFile}
          file={file}
        />
      ))}
      {(!maxFiles || files.length < maxFiles) && (
        <StyledDropzone
          {...getRootProps({ className: 'dropzone' })}
          isDragActive={isDragActive}
          isDragReject={isDragReject}
          isLoading={isLoading}>
          <input {...getInputProps()} />
          <>
            {isLoading ? (
              <StyledProgressWrapper>
                <CircularProgressBar
                  value={uploadingProgress}
                  strokeWidth={14}
                  styles={{ trail: { stroke: theme.colors.lightBlue }, path: { stroke: theme.colors.blue } }}
                  showProgressText={false}
                />
              </StyledProgressWrapper>
            ) : (
              <>
                {!isDragReject && <images.More />}
                <StyledLabel
                  prefix={isDragReject ? 'Error:' : ''}
                  text={!isDragReject ? draggableText : draggableErrorText}
                  size={!isDragReject ? 'large' : 'small'}
                  variant='currentColor'
                  lowercase
                />
                {isDragReject && <StyledImageClose />}
              </>
            )}
          </>
        </StyledDropzone>
      )}
    </StyledWrapper>
  );
}
