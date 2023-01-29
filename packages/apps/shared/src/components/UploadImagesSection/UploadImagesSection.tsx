import styled from 'styled-components';
import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';
import Matterport from './Matterport';
import InnerStepFormLayout from '../InnerStepFormLayout';
import DropZone from '../DropZone';
import { CustomFile } from '../../hooks';

const StyledWrapper = styled.div`
  width: 100%;
  margin-top: 43px;
  display: flex;
  flex-direction: column;
  row-gap: 40px;
`;

type Props = {
  description: string;
  getRootProps: DropzoneRootProps;
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps;
  isDragActive: boolean;
  isDragReject: boolean;
  files: CustomFile[];
  handleRemove: (file?: Partial<CustomFile>) => Promise<void>;
  isRemovingFile: boolean;
  isError: boolean;
  isLoading: boolean;
  progress: number;
  draggableErrorText?: string;
  errorText?: string;
};

export default function UploadImagesSection({
  description,
  getRootProps,
  getInputProps,
  isDragActive,
  isDragReject,
  files,
  handleRemove,
  isRemovingFile,
  isError,
  isLoading,
  progress,
  draggableErrorText,
  errorText,
}: Props) {
  return (
    <InnerStepFormLayout label='Imágenes' description={description}>
      <StyledWrapper>
        <DropZone
          files={files}
          draggableErrorText={errorText || draggableErrorText}
          draggableText='Agregar o arrastrar imágenes'
          handleRemove={handleRemove}
          isRemovingFile={isRemovingFile}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
          isDragReject={isDragReject || isError}
          isLoading={isLoading}
          uploadingProgress={progress}
        />
        <Matterport />
      </StyledWrapper>
    </InnerStepFormLayout>
  );
}
