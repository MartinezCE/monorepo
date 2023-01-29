/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Input, useGetMe } from '@wimet/apps-shared';
import { FormikProvider, useFormik } from 'formik';
import styled from 'styled-components';
import * as Yup from 'yup';

import useCreateInvitations, { CreateInvitationPayload } from '../../../../hooks/api/useCreateInvitations';
import ModalActions from '../../../UI/ModalActions';

const StyledText = styled.div`
  font-size: 14px;
  font-weight: 200;
  color: ${({ theme }) => theme.colors.darkGray};
  margin-bottom: 48px;
`;

const StyledInput = styled(Input)`
  margin-bottom: 104px;
  & label {
    text-align: left;
    color: ${({ theme }) => theme.colors.darkGray};
  }
`;

const schema = Yup.object().shape({
  emails: Yup.array()
    .of(
      Yup.object().shape({
        email: Yup.string().email('Debe ingresar un email válido'),
      })
    )
    .min(1, 'Debe ingresar al menos un correo electrónico'),
});

type Props = {
  onClickSubmit?: () => void;
  onClickCancel?: () => void;
};

const CreateFromEmail = ({ onClickSubmit, onClickCancel }: Props) => {
  const { data } = useGetMe();
  const { mutateAsync, isLoading } = useCreateInvitations();

  const formik = useFormik({
    initialValues: { unparsedEmails: '', emails: [] as CreateInvitationPayload['emails'] },
    validationSchema: schema,
    onSubmit: async ({ emails }) => {
      await mutateAsync({ companyId: data?.companies[0].id, emails });
      onClickSubmit?.();
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emails = e.target.value
      .split(',')
      .map(email => ({ email: email.trim() }))
      .filter(({ email }) => !!email);
    formik.setFieldValue('unparsedEmails', e.target.value);
    formik.setFieldValue('emails', emails);
  };

  return (
    <FormikProvider value={formik}>
      <StyledText>Ingrese el mail de cada miembro separado por comas</StyledText>
      <StyledInput
        label='Correos electrónicos'
        name='emails'
        placeholder='nombre1@tuempresa.com, nombre2@tuempresa.com'
        onChange={handleInputChange}
        value={formik.values.unparsedEmails}
      />
      <ModalActions onClickSubmit={() => formik.submitForm()} onClickCancel={onClickCancel} isDisabled={isLoading} />
    </FormikProvider>
  );
};

export default CreateFromEmail;
