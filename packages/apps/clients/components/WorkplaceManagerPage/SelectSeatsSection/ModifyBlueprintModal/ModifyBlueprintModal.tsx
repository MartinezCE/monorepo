import React from 'react';
import { Modal, images, Link } from '@wimet/apps-shared';
import styled, { css } from 'styled-components';
import { FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/router';
import UploadBlueprintSection from './UploadBlueprintSection';
import ModalActions from '../../../UI/ModalActions';
import { useUpdateBlueprint } from '../../../../hooks/api/useUpdateBlueprint';

const StyledWrappedModal = styled(Modal)`
  height: 100vh;
  width: 100vw;
  background-color: rgb(44 48 56 / 80%) !important;
  > div {
    width: 610px;
    height: 614px;
    background-color: ${({ theme }) => theme.colors.extraLightGray};
    & > div > button {
      color: ${({ theme }) => theme.colors.darkGray};
    }
  }
`;
const StyledContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 68px 100px 64px 100px;
`;

const StyledTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkGray};
  margin-bottom: 24px;
`;

const StyledWarningWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledWarningIcon = styled(images.Warning)`
  width: 18px;
  height: 18px;
  color: ${({ theme }) => theme.colors.error};
`;

const StyledText = css`
  text-align: left;
  font-size: 14px;
  font-weight: 200;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StyledWarningText = styled.div`
  ${StyledText}
  color: ${({ theme }) => theme.colors.error};
  & span {
    ${StyledText}
    font-weight: 500;
    color: ${({ theme }) => theme.colors.error};
  }
`;

const StyledDownloadWrapper = styled.div`
  margin-top: 16px;
  ${StyledText}
  & span {
    ${StyledText}
  }
  margin-bottom: 48px;
`;

const StyledLink = styled(Link)`
  display: inline-block;
  color: ${({ theme }) => theme.colors.blue};
`;

const StyledUploadFileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 64px;
  width: 100%;
`;

const StyledDropMessage = styled.div`
  margin-top: 16px;
  width: 100%;
  text-align: right;
  font-size: 12px;
  font-weight: 200;
  color: ${({ theme }) => theme.colors.darkGray};
`;

type Props = {
  blueprintId: number;
  currentBlueprintURL: string;
  onClose: () => void;
};

const ModifyBlueprintModal = ({ onClose, currentBlueprintURL, blueprintId }: Props) => {
  const router = useRouter();
  const { progress, mutateAsync: updateBlueprint, isLoading } = useUpdateBlueprint(router.query.locationId as string);

  const formik = useFormik({
    initialValues: {
      blueprint: [] as File[],
    },
    onSubmit: async values => {
      const data = new FormData();
      values.blueprint.forEach(f => data.append('blueprint', f));
      await updateBlueprint({ data, blueprintId });
      onClose();
    },
  });

  return (
    <StyledWrappedModal onClose={onClose}>
      <FormikProvider value={formik}>
        <StyledContentWrapper>
          <StyledTitle>Modificar plano</StyledTitle>
          <StyledWarningWrapper>
            <StyledWarningIcon />
            <StyledWarningText>
              <span>Importante: </span> si se carga un nuevo plano con diferente número de píxeles, todos los asientos y
              sus reservas se borrarán.
            </StyledWarningText>
          </StyledWarningWrapper>
          <StyledDownloadWrapper>
            <StyledLink href={currentBlueprintURL} variant='transparent' noBackground download>
              Descargar plano actual
            </StyledLink>
            <span> para editarlo y volver a cargarlo. Así no perderá ningún sitio ni reservas.</span>
          </StyledDownloadWrapper>
          <StyledUploadFileWrapper>
            <UploadBlueprintSection isLoading={isLoading} uploadingProgress={progress} />
            <StyledDropMessage>Debe ser un archivo .jpg, .jpeg o .png</StyledDropMessage>
          </StyledUploadFileWrapper>
          <ModalActions
            actionText='Modificar'
            onClickCancel={onClose}
            onClickSubmit={formik.submitForm}
            isDisabled={isLoading || !formik.dirty}
          />
        </StyledContentWrapper>
      </FormikProvider>
    </StyledWrappedModal>
  );
};

export default ModifyBlueprintModal;
