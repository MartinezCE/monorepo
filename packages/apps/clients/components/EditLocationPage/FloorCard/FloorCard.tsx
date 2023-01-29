import { DropZone, Input, DropzonePreview, Blueprint } from '@wimet/apps-shared';
import { useState } from 'react';
import styled, { css } from 'styled-components';
import useHandleBlueprints from '../../../hooks/useHandleBlueprints';
import ModifyBlueprintModal from '../../WorkplaceManagerPage/SelectSeatsSection/ModifyBlueprintModal';
import BlueprintName from './BlueprintName';

const StyledPreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  align-items: center;
  margin-bottom: 20px;
`;

const StyledContainer = styled.div`
  width: 100%;
`;

const SytyledFloorNumberContainer = styled.div`
  max-width: 484px;
  margin-bottom: 40px;
`;

const StyledImagesContainer = styled.div`
  display: flex;
  flex: 1;
  gap: 40px;
  overflow: auto;

  & > div {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
`;

const previewMixin = css`
  width: 100%;
  min-width: 155px;
`;

const StyledPreview = styled(DropzonePreview)`
  ${previewMixin}
`;

const StyledDropzone = styled(DropZone)`
  ${previewMixin}
  & > div {
    width: 100%;
  }
`;

type Props = {
  blueprints: Blueprint[];
  id: string;
  index: number;
};

export default function FloorCard({ id, blueprints, index }: Props) {
  const [modifyBlueprintModal, setModifyBlueprintModal] = useState<{ show: boolean; blueprint: Blueprint | null }>({
    show: false,
    blueprint: null,
  });
  const { getRootProps, getInputProps, isLoading, progress, handleRemove, isRemovingFile } = useHandleBlueprints({
    floorId: id,
    fieldName: 'blueprints',
  });

  // TODO: Integrate Swipper for preview images
  return (
    <StyledContainer>
      <SytyledFloorNumberContainer>
        <Input
          label='Nombre del Piso / Plano'
          placeholder='Piso 1 / Planta baja'
          type='number'
          name={`floors[${index}].number`}
        />
      </SytyledFloorNumberContainer>
      <StyledPreviewContainer>
        <StyledImagesContainer>
          {blueprints.map((blueprint, i) => (
            <div key={blueprint.id}>
              <StyledPreview
                handleRemove={() => handleRemove(blueprint.id)}
                handleEdit={() => setModifyBlueprintModal({ show: true, blueprint })}
                preview={blueprint.url || '/images/placeholder.png'}
                isRemovingFile={isRemovingFile}
                showEditButton
              />
              <BlueprintName
                blueprintId={blueprint.id.toString()}
                floorId={id}
                floorIndex={index}
                blueprintIndex={i}
                readOnly={false}
              />
            </div>
          ))}
          <div>
            <StyledDropzone
              isLoading={isLoading}
              uploadingProgress={progress}
              draggableErrorText='el archivo debe ser una imagen de 4mb como máximo.'
              draggableText='Agregar o arrastrar imagen'
              getRootProps={getRootProps}
              getInputProps={getInputProps}
            />
          </div>
        </StyledImagesContainer>
      </StyledPreviewContainer>
      {modifyBlueprintModal.show && modifyBlueprintModal.blueprint && (
        <ModifyBlueprintModal
          blueprintId={modifyBlueprintModal.blueprint.id}
          onClose={() => setModifyBlueprintModal({ show: false, blueprint: null })}
          currentBlueprintURL={modifyBlueprintModal.blueprint.url}
        />
      )}
    </StyledContainer>
  );
}
