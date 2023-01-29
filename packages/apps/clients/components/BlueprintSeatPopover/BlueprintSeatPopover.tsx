import React, { useMemo, useState } from 'react';
import {
  Button,
  Input,
  LoadingSpinner,
  Select,
  spaceTypeFilterLabels,
  Switch,
  useGetAllSpacesTypes,
  useGetMe,
  images,
} from '@wimet/apps-shared';
import styled from 'styled-components';
import { FormikProvider, useFormik } from 'formik';
import { LatLng, latLng } from 'leaflet';
import * as Yup from 'yup';
import { ButtonIconMixin } from '@wimet/apps-shared/lib/common/mixins';
import { useRouter } from 'next/router';
import useCreateSeat from '../../hooks/api/useCreateSeat';
import useUpdateSeat from '../../hooks/api/useUpdateSeat';
import useCreateAmenity from '../../hooks/api/useCreateAmenity';
import { LayerPoint, MarkerProps } from '../../hooks/useBlueprintToolbar';
import useGetCompanyAmenities from '../../hooks/api/useGetCompanyAmenities';
import useDeleteSeat from '../../hooks/api/useDeleteSeat';

const StyledBackdrop = styled.div`
  height: 100vh;
  width: 100vw;
  position: fixed;
  background-color: rgb(44 48 56 / 50%);
  z-index: 200;
  top: 0;
  left: 0;
`;

const StyledPopoverContainer = styled.div<{ position: LayerPoint | null }>`
  width: 300px;
  position: absolute;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  border: solid 1px ${({ theme }) => theme.colors.extraLightGray};
  box-shadow: ${({ theme }) => theme.shadows[1]};
  top: ${({ position }) => `${position ? position?.y + 10 : 0}px`};
  left: ${({ position }) => `${position ? position?.x + 10 : 0}px`};

  /** con este valor se tapa el messenger de intercom: z-index del icono floteante de intercom 2147483003 */
  z-index: 2150000000;
`;

const StyledPopupTitle = styled.h6`
  text-align: center;
`;

const StyledPopupFormWrapper = styled.div`
  display: flex;
  color: ${({ theme }) => theme.colors.darkGray};
  flex: 1;
  flex-direction: column;
  width: 100%;
  gap: 20px;
`;

const StyledFlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-top: 30px;

  > button {
    flex-grow: 1;
  }
`;

const StyledPopupSelect = styled(Select)`
  .react-select__control + div {
    max-height: 210px;
    overflow-y: auto;
  }
`;

const StyledDeleteSeatButton = styled(Button)`
  ${ButtonIconMixin};
`;

const validationSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es obligatorio'),
});

type SelectOption = { value: number; label: string };

type BlueprintSeatPopoverProps = {
  seatsData?: MarkerProps | null;
  onClose: () => void;
  addSeatCoordinates: LatLng | null;
  blueprintId: number;
  position: LayerPoint | null;
};

const BlueprintSeatPopover = ({
  seatsData,
  onClose,
  addSeatCoordinates,
  blueprintId,
  position,
}: BlueprintSeatPopoverProps) => {
  const [createdAmenities, setCreatedAmenities] = useState<SelectOption[]>([]);
  const { data: userData } = useGetMe();
  const router = useRouter();
  const { locationId } = router.query;
  const { mutateAsync: createAmenity, isLoading: isCreatingAmenity } = useCreateAmenity();
  const { mutateAsync: createSeat, isLoading: isCreatingSeat } = useCreateSeat(blueprintId, locationId as string);
  const { mutateAsync: updateSeat, isLoading: isUpdatingSeat } = useUpdateSeat(locationId as string);
  const { mutateAsync: deleteSeat, isLoading: isDeleatingSeat } = useDeleteSeat(locationId as string);
  const { data: spaceTypeOptions = [], isLoading: isGettingAllSpaceTypes } = useGetAllSpacesTypes({
    select: types => types.map(t => ({ value: t.id, label: spaceTypeFilterLabels[t.value] })),
  });
  const { data: seatAmenities = [] } = useGetCompanyAmenities(Number(userData?.companies[0].id), {
    select: amenities => amenities?.map(a => ({ value: a.id, label: a.name })),
  });

  const amenitiesOptions = useMemo(
    () => [...new Set([...seatAmenities, ...createdAmenities])],
    [createdAmenities, seatAmenities]
  );

  const formik = useFormik({
    initialValues: {
      id: seatsData?.id,
      name: seatsData?.name || '',
      amenities: seatsData?.amenities?.map(a => ({ value: a.id, label: a.name })) || [],
      isAvailable: seatsData?.isAvailable ?? true,
      spaceTypeId: seatsData?.spaceTypeId || 1,
    },
    validationSchema,
    onSubmit: async values => {
      const pos = {
        lat: (addSeatCoordinates || seatsData?.pos || latLng(0, 0)).lat,
        lng: (addSeatCoordinates || seatsData?.pos || latLng(0, 0)).lng,
      };

      const newValues = {
        id: Number(values.id),
        name: values.name,
        isAvailable: values.isAvailable,
        geometry: {
          coordinates: [pos?.lat, pos?.lng] as [number, number],
          type: 'Point',
        },
        amenities: values.amenities.map(a => a.value),
        spaceTypeId: values.spaceTypeId,
      };
      if (values.id) {
        await updateSeat({ seatId: seatsData?.id || '', payload: newValues });
      } else {
        await createSeat(newValues);
      }
      onClose();
    },
  });

  const handleOnChangeIsAvailable = () => formik.setFieldValue('isAvailable', !formik.values.isAvailable);

  const handleOnCreateOption = async (name: string) => {
    const amenity = await createAmenity({ name });
    const newOption = { value: amenity.id, label: name };
    setCreatedAmenities([...createdAmenities, newOption]);
    formik.setFieldValue('amenities', [...formik.values.amenities, newOption]);
  };

  const handleOnClickDelete = async () => {
    await deleteSeat({ seatId: seatsData?.id || '' });
    onClose();
  };

  return (
    <FormikProvider value={formik}>
      <StyledPopoverContainer position={position} id='AddSeatPopupConatiner'>
        <StyledPopupFormWrapper>
          <StyledPopupTitle>{seatsData?.id ? 'Editar' : 'Añadir'} asiento</StyledPopupTitle>
          <Input name='name' label='Nombre de posición' placeholder='Escritorio 1' />
          <StyledPopupSelect
            name='spaceTypeId'
            label='Tipo de posición*'
            instanceId='spaceTypeFilterLabels'
            isCreatable
            isClearable={false}
            placeholder='Seleccionar tipo escritorio'
            options={spaceTypeOptions}
            isDisabled={!!seatsData?.id}
            isLoading={isGettingAllSpaceTypes}
            value={spaceTypeOptions.find(option => option?.value === formik.values.spaceTypeId)}
          />
          <StyledPopupSelect
            name='amenities'
            label='Amenities'
            instanceId='amenitiesOptions'
            isMulti
            createLabel='Agregar nuevo amenity'
            isCreatable
            isClearable={false}
            placeholder='Asociar amenity'
            noOptionsMessage={() => 'No tenés ningun amenity cargado, escribe para agregar uno'}
            onCreateOption={handleOnCreateOption}
            isLoading={isCreatingAmenity}
            isDisabled={isCreatingAmenity}
            options={amenitiesOptions}
            value={formik.values.amenities}
          />
          <StyledFlexContainer>
            <Switch
              label='Bloquear asiento'
              checked={!formik.values.isAvailable}
              onChange={handleOnChangeIsAvailable}
            />
            {seatsData?.id && (
              <StyledDeleteSeatButton
                variant='tertiary'
                leadingIcon={isDeleatingSeat ? <LoadingSpinner /> : <images.TinyBin />}
                onClick={handleOnClickDelete}
              />
            )}
          </StyledFlexContainer>
        </StyledPopupFormWrapper>

        <StyledButtonsContainer>
          <Button variant='outline' onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant='primary'
            onClick={formik.submitForm}
            trailingIcon={isCreatingSeat || isUpdatingSeat ? <LoadingSpinner /> : undefined}
            disabled={isCreatingSeat || isUpdatingSeat || isCreatingAmenity || isDeleatingSeat}>
            {seatsData?.id ? 'Guardar' : 'Agregar'}
          </Button>
        </StyledButtonsContainer>
      </StyledPopoverContainer>
      <StyledBackdrop />
    </FormikProvider>
  );
};

export default BlueprintSeatPopover;
