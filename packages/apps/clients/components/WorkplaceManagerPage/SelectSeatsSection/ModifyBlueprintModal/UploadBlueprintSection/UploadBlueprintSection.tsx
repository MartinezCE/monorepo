import { DropZone, useDropzoneErrorMessage, images, CircularProgressBar, Label } from '@wimet/apps-shared';
import Image from 'next/image';
import styled, { useTheme } from 'styled-components';
import useHandleUploadBlueprintFiles from '../../../../../hooks/useHandleUploadBlueprintFiles';

const StyledWrapper = styled.div`
  width: 100%;
  height: 116px;
`;

const StyledDropZone = styled(DropZone)`
  width: 100%;
  height: 100%;
  & > div {
    width: 100%;
    height: 100%;
  }
`;

const StyledImageWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

const StyledRemoveWrapper = styled.div`
  position: absolute;
  width: 17px;
  height: 17px;
  background-color: ${({ theme }) => theme.colors.gray};
  z-index: 1;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  right: 8px;
  top: 8px;
`;
const StyledRemoveIcon = styled(images.Close)`
  color: ${({ theme }) => theme.colors.darkGray};
  transform: scale(0.55) translate(-1px, -1px);
  & path {
    stroke-width: 3;
  }
`;

const StyledProgressWrapper = styled.div`
  width: 100%;
  height: 100%;
  & > div {
    height: 100%;
    & svg {
      height: 100%;
    }
  }
`;

const StyledLabel = styled(Label)`
  font-weight: ${({ theme }) => theme.fontWeight[1]};
  color: ${({ theme }) => theme.colors.error};
  font-size: 12px;
`;

type Props = {
  isLoading: boolean;
  uploadingProgress: number;
};

export default function UploadBlueprintSection({ isLoading, uploadingProgress }: Props) {
  const theme = useTheme();
  const { getRootProps, getInputProps, isDragActive, isDragReject, filesToUpload, previewPaths, error, removeFile } =
    useHandleUploadBlueprintFiles({
      files: [],
      type: 'IMAGE',
      maxSize: 4194304,
      maxFiles: 1,
      accept: 'image/jpeg,image/png',
      multiple: true,
      fieldName: 'blueprint',
    });

  const errorMessage = useDropzoneErrorMessage({
    fileType: 'img',
    showError: !!error,
    error,
  });

  return (
    <StyledWrapper>
      {(!previewPaths || (previewPaths && previewPaths.length <= 0)) && (
        <>
          <StyledDropZone
            maxFiles={1}
            files={filesToUpload}
            draggableErrorText='Sólo se permite 1 archivo de tipo jpg o png.'
            draggableText='Agregar o arrastrar imágenes'
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
            isLoading={isLoading}
            isDragReject={isDragReject}
            isError={!!errorMessage}
            errorText={errorMessage}
            uploadingProgress={uploadingProgress}
            hideRemoveModal
          />
          {!!error && (
            <StyledLabel
              prefix={isDragReject ? 'Error:' : ''}
              text={errorMessage}
              size='large'
              variant='currentColor'
              lowercase
            />
          )}
        </>
      )}
      {previewPaths && previewPaths.length > 0 && (
        <StyledImageWrapper>
          {isLoading && (
            <StyledProgressWrapper>
              <CircularProgressBar
                value={uploadingProgress}
                strokeWidth={14}
                styles={{ trail: { stroke: theme.colors.lightBlue }, path: { stroke: theme.colors.blue } }}
                showProgressText={false}
              />
            </StyledProgressWrapper>
          )}
          {!isLoading && (
            <>
              <StyledRemoveWrapper onClick={removeFile}>
                <StyledRemoveIcon />
              </StyledRemoveWrapper>
              <Image src={previewPaths[0]} layout='fill' objectFit='cover' />
            </>
          )}
        </StyledImageWrapper>
      )}
    </StyledWrapper>
  );
}
