/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Link, images, useGetMe } from '@wimet/apps-shared';
import styled from 'styled-components';
import { FormikProvider, useFormik } from 'formik';
import { Workbook } from 'exceljs';

import UploadFilesSection from './UploadFilesSection';
import useCreateInvitations, { CreateInvitationPayload } from '../../../../hooks/api/useCreateInvitations';
import ModalActions from '../../../UI/ModalActions';

const StyledTextWrapper = styled.div`
  margin-bottom: 48px;
  display: flex;
  align-items: center;
  padding-left: 58px;
  padding-right: 58px;
`;

const StyledText = styled.div`
  margin-left: 18px;
  font-size: 14px;
  font-weight: 200;
  color: ${({ theme }) => theme.colors.darkGray};
  text-align: left;
`;

const StyledLink = styled(Link)`
  display: inline-block;
  color: ${({ theme }) => theme.colors.blue};
`;

const StyledIconWrapper = styled.div`
  width: 18px;
`;

const SyledIcon = styled(images.Download)`
  transform: scale(0.82);
  color: ${({ theme }) => theme.colors.blue};
`;

const StyledUploadFileWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 56px;
`;

type Props = {
  onClickSubmit?: () => void;
  onClickCancel?: () => void;
};

const CreateFromXLS = ({ onClickSubmit, onClickCancel }: Props) => {
  const { data } = useGetMe();
  const { mutateAsync } = useCreateInvitations();

  const formik = useFormik({
    initialValues: { files: [] as File[] },
    onSubmit: async ({ files }) => {
      const wb = new Workbook();
      const book = await wb.xlsx.load(files[0] as unknown as Buffer);
      const sheet = book.worksheets[0];

      const emails = [] as CreateInvitationPayload['emails'];
      sheet.eachRow((row, i) => {
        if (i === 1) return;

        emails.push({
          email: row.getCell(1).value?.toString(),
          firstName: row.getCell(2).value?.toString(),
          lastName: row.getCell(3).value?.toString(),
        });
      });

      await mutateAsync({ companyId: data?.companies[0].id, emails });
      onClickSubmit?.();
    },
  });

  const handleDropAccepted = async (files: File[]) => formik.setFieldValue('files', files);
  const handleRemoveFile = () => formik.setFieldValue('files', []);

  return (
    <FormikProvider value={formik}>
      <StyledTextWrapper>
        <StyledIconWrapper>
          <SyledIcon />
        </StyledIconWrapper>
        <StyledText>
          <StyledLink href='/assets/Wimet-Template.xlsx' variant='transparent' noBackground download>
            Descarga la planilla .xls
          </StyledLink>
          , completala con el listado de los miembros de tu empresa y sube el archivo
        </StyledText>
      </StyledTextWrapper>
      <StyledUploadFileWrapper>
        <UploadFilesSection
          files={formik.values.files}
          onDropAccepted={handleDropAccepted}
          handleRemove={handleRemoveFile}
        />
      </StyledUploadFileWrapper>
      <ModalActions
        onClickCancel={onClickCancel}
        onClickSubmit={() => formik.submitForm()}
        isDisabled={!formik.values.files.length}
        isSubmitting={formik.isSubmitting}
      />
    </FormikProvider>
  );
};

export default CreateFromXLS;
