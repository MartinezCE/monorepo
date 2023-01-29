import {
  DropZone,
  InnerStepFormLayout,
  useHandleUploadLocationFiles,
  useDropzoneErrorMessage,
  DocumentPreview,
} from '@wimet/apps-shared';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import useGetLocation, { GET_LOCATION } from '../../../hooks/api/useGetLocation';

const StyledWrapper = styled.div`
  width: 100%;
  margin-top: 43px;
  display: flex;
  flex-direction: column;
  row-gap: 40px;
`;

type Props = {
  description: string;
};

export default function UploadDocsSection({ description }: Props) {
  const router = useRouter();
  const { locationId } = router.query;
  const { data: locationData = {} } = useGetLocation(locationId as string);

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
    queryToInvalidate: GET_LOCATION,
    files: locationData.locationFiles?.documents || [],
    maxSize: 4194304,
    maxFiles: 10,
    accept: 'application/pdf, application/msword',
    fieldName: 'locationFiles',
    multiple: true,
    type: 'DOCUMENT',
  });

  const errorMessage = useDropzoneErrorMessage({ fileType: 'doc', showError: !!error, error });

  return (
    <InnerStepFormLayout label='Documentos' description={description}>
      <StyledWrapper>
        <DropZone
          files={files}
          draggableErrorText={errorMessage || 'el archivo debe ser un documento .pdf o .doc de 4MB como máximo.'}
          draggableText='Agregar o arrastrar documentos'
          handleRemove={handleRemove}
          isRemovingFile={isRemovingFile}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
          isDragReject={isDragReject || !!errorMessage}
          isLoading={isLoading}
          uploadingProgress={progress}
          getPreview={file => <DocumentPreview name={file?.name} />}
        />
      </StyledWrapper>
    </InnerStepFormLayout>
  );
}
