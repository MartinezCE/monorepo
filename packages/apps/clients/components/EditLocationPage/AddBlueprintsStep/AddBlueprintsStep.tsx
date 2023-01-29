import { Button, images, Input, LoadingSpinner, Modal } from '@wimet/apps-shared';
import { useFormikContext } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useCreateBlueprint } from '../../../hooks/api/useCreateBlueprint';
import useCreateFloor, { CreateFloorPayload } from '../../../hooks/api/useCreateFloor';
import imgBlueprint from '../../../public/images/bg_blueprint.png';
import FileUploader from '../../FileUploader';
import CustomHeader from '../../WorkplaceManagerPage/SelectSeatsSection/CustomHeader';

interface Props {
  src?: string;
  width?: string;
  height?: string;
}

const StyledContainer = styled.div`
  padding: 75px 0 0 8em;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 4em;
  margin-top: 1em;
`;

const BgBlueprint = styled.div<Props>`
  background-image: ${props => `url(${props.src})`};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 614px;
  background-size: contain;
  background-repeat: no-repeat;
`;

const BgBlueprintAction = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  > p {
    font-weight: 300;
    font-size: 20px;
    line-height: 28px;
    text-align: center;
    color: #999999;
  }
`;

const StyledWrapper = styled.div`
  width: 610px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 20px;
  padding: 70px 80px;
`;

const StyleInput = styled(Input)`
  width: 100%;
  > label {
    text-align: initial;
  }
`;

const StyledDropzoneInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ActionButton = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 2em;
`;

export default function AddBlueprintsStep() {
  const [showModal, setShowModal] = useState(true);
  const [blueprintFile, setBlueprintFile] = useState<File[]>([]);
  const { values } = useFormikContext<{ floor: string; name: string }>();
  const router = useRouter();
  const { locationId } = router.query;
  const { mutateAsync } = useCreateFloor(locationId as string);
  const { mutateAsync: createBlueprint, isLoading: loadingBlueprint } = useCreateBlueprint(locationId as string);
  const handleAddFloor = (paylod: CreateFloorPayload) => mutateAsync(paylod);

  const disableSubmit = !blueprintFile.length || !values.floor;

  const saveFloor = async () => {
    const file = blueprintFile[0];
    const floor = await handleAddFloor({ number: values.floor });
    const data = new FormData();
    data.append('blueprints', file);
    const blueprint = await createBlueprint({
      data,
      floorId: floor.id.toString(),
    });

    if (!blueprint.length) return;

    router.push(
      `/workplace-manager/locations/${locationId}/edit?step=2&floorId=${floor.id}&blueprintId=${blueprint[0].id}`
    );
  };

  return (
    <StyledContainer>
      <CustomHeader section='Planos' locationName={values.name} />
      <BgBlueprint src={imgBlueprint.src}>
        <BgBlueprintAction>
          <p>Seleccione un piso y plano para indicar su disponibilidad</p>
          <Button
            variant='primary'
            style={{ marginTop: '2em', width: '80%', borderColor: 'gray' }}
            onClick={() => setShowModal(true)}>
            Crear un plano
            <images.More />
          </Button>
        </BgBlueprintAction>
        {showModal && (
          <Modal variant='light' onClose={() => setShowModal(false)}>
            <StyledWrapper>
              <StyleInput
                label='Nombre del Piso / Plano'
                placeholder='Piso 1 / Planta baja'
                type='string'
                name='floor'
                disabled={loadingBlueprint}
              />
              <FileUploader useCase='blueprint' onChangeFiles={setBlueprintFile}>
                <StyledDropzoneInfo>
                  <span className='dropzone-info-plus-icon'>
                    <images.TinyMore />
                  </span>
                  <span className='dropzone-info-text'>Agregar o arrastrar imagen</span>
                </StyledDropzoneInfo>
              </FileUploader>
              <ActionButton>
                <Button variant='primary' onClick={saveFloor} disabled={disableSubmit}>
                  {loadingBlueprint ? <LoadingSpinner /> : 'Crear'}
                </Button>
              </ActionButton>
            </StyledWrapper>
          </Modal>
        )}
      </BgBlueprint>
    </StyledContainer>
  );
}
