/* eslint-disable @next/next/no-img-element */
import { ReactNode, useMemo, useState } from 'react';
import {
  AmenityButton,
  AmenityType,
  Button,
  getAmenityTypeLabel,
  images,
  InnerStepFormLayout,
  Text,
  Amenity,
  DeleteBaseModal,
  useModal,
} from '@wimet/apps-shared';
import styled, { css } from 'styled-components';
import { useFormikContext } from 'formik';
import type { EditLocationInitialValues } from '../../../pages/locations/[locationId]/edit';
import useGetAmenities, { AmenitiesResponse, AmenitiesWithoutCustom } from '../../../hooks/api/useGetAmenities';

const StyledWrapper = styled.div`
  max-width: 830px;
  margin-top: 64px;
  display: flex;
  flex-direction: column;
  row-gap: 56px;
`;

const StyledInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 28px;
`;

const StyledAmenitiesWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  column-gap: 28px;
  row-gap: 32px;
`;

const StyledText = styled(Text)`
  font-weight: ${({ theme }) => theme.fontWeight[2]};
`;

const StyledAmenityButton = styled(AmenityButton)`
  > button {
    border: 2px dashed ${({ theme }) => theme.colors.darkGray};

    &:hover,
    &:focus {
      border: 2px dashed ${({ theme }) => theme.colors.blue};
      color: ${({ theme }) => theme.colors.blue};
    }
  }

  > span {
    min-width: unset;
    max-width: 80px;
    font-weight: ${({ theme }) => theme.fontWeight[2]};
  }
`;

const StyledButton = styled(Button)`
  max-width: 181px;
`;

type StyledChevronDownIconProps = {
  isActive?: boolean;
};

const StyledChevronDownIcon = styled(images.ChevronDown)<StyledChevronDownIconProps>`
  transition: transform 0.2s ease-in-out;

  ${({ isActive }) =>
    isActive &&
    css`
      transform: rotate(180deg);
    `}
`;

type FormAmenities = EditLocationInitialValues['amenities'][number];

type Props = {
  amenitiesType: AmenitiesWithoutCustom[];
  description: string;
  addModalComponent: (handleModalClose: () => void, handleModalConfirm: () => void) => ReactNode;
};

export default function SelectAmenitiesSection({ amenitiesType, description, addModalComponent }: Props) {
  const { handleOpenModal, handleCloseModal, removeItem, modalType } = useModal<'add' | 'remove', FormAmenities>();
  const [showMore, setShowMore] = useState(false);
  const { data: defaultAmenities = {} as AmenitiesResponse } = useGetAmenities<AmenitiesResponse>(amenitiesType);
  const { values, setFieldValue } = useFormikContext<EditLocationInitialValues>();
  const allAmenities = useMemo(() => {
    const customAmenities = values.amenities.filter(a => !a.isDefault);
    return { ...defaultAmenities, CUSTOM: customAmenities };
  }, [values.amenities, defaultAmenities]);

  const handleSelectAmenity = (amenity: FormAmenities) =>
    setFieldValue(
      'amenities',
      values.amenities.some(a => a.id === amenity.id)
        ? values.amenities.filter(a => a.id !== amenity.id)
        : [...values.amenities, amenity]
    );

  const handleModalConfirm = (newAmenity?: Amenity) => {
    if (!newAmenity || values.amenities.some(a => a.id === newAmenity.id)) return;
    setFieldValue('amenities', [...values.amenities, newAmenity]);
  };

  return (
    <InnerStepFormLayout label='Amenities' description={description}>
      <StyledWrapper>
        {Object.entries(allAmenities).map(([amenityType, amenities], i) => (
          <StyledInnerWrapper key={amenityType}>
            {i > 0 && <StyledText variant='large'>{getAmenityTypeLabel(amenityType as AmenityType)}</StyledText>}
            <StyledAmenitiesWrapper>
              {(amenities || []).slice(0, !showMore ? 18 : undefined).map(amenity => (
                <AmenityButton
                  key={amenity.id}
                  label={amenity.name}
                  icon={
                    amenity.isDefault ? (
                      <img
                        src={`https://wimet-prod.s3.us-west-2.amazonaws.com/amenities/${amenity.fileName}`}
                        alt={amenity.name}
                      />
                    ) : (
                      <images.Star />
                    )
                  }
                  active={!!values.amenities.find(a => a.id === amenity.id)}
                  onClick={() => {
                    if (amenity.isDefault) return handleSelectAmenity(amenity);
                    return handleOpenModal('remove', amenity);
                  }}
                />
              ))}
              {amenityType === AmenityType.CUSTOM && (
                <StyledAmenityButton
                  label='Agregar amenities'
                  icon={<images.TinyMore />}
                  onClick={() => handleOpenModal('add')}
                />
              )}
            </StyledAmenitiesWrapper>
            {i === 0 && (amenities || []).length > 18 && (
              <StyledButton variant='outline' onClick={() => setShowMore(!showMore)}>
                {!showMore ? 'Ver más' : 'Ver menos'} <StyledChevronDownIcon isActive={showMore} />
              </StyledButton>
            )}
          </StyledInnerWrapper>
        ))}
      </StyledWrapper>
      {modalType === 'add' && addModalComponent(handleCloseModal, handleModalConfirm)}
      {modalType === 'remove' && (
        <DeleteBaseModal
          title='¿Eliminar amenity?'
          onClose={handleCloseModal}
          onCancel={handleCloseModal}
          onConfirm={() => removeItem && handleSelectAmenity(removeItem)}
        />
      )}
    </InnerStepFormLayout>
  );
}
