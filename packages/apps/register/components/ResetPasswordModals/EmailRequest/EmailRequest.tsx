import * as Yup from 'yup';
import styled from 'styled-components';
import { Form, FormikProvider, useFormik } from 'formik';
import { Button, Input, LoadingSpinner, Modal } from '@wimet/apps-shared';
import { LockCircle } from '@wimet/apps-shared/lib/assets/images';
import usePasswordRecovery from '../../../hooks/api/Auth/usePasswordRecovery';

const StyledWrapperModal = styled.div`
  width: 680px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 38px;
  padding: 50px 70px;
  box-shadow: ${({ theme }) => theme.shadows[0]};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 30px;
`;

const StyledTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 12px;
`;

const StyledTitle = styled.p`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.darkBlue};
  font-size: 24px;
  margin: 0;
  letter-spacing: 0.02em;
`;

const StyledSubtitle = styled.p`
  font-weight: 400;
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: 16px;
`;

const StyledInputWrapper = styled.div`
  width: 70%;
  text-align: start;
`;

const StyledButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 24px;
  align-items: center;
`;

const StyledGoBackButton = styled.button`
  color: ${({ theme }) => theme.colors.black};
  font-size: 14px;
  font-weight: 400;
  background-color: unset;
  border: unset;
  cursor: pointer;
`;

const validationSchema = Yup.object({
  email: Yup.string().trim().required('Este campo es obligatorio').email('El email no es válido'),
});

const ResetPasswordModalEmailRequest = ({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) => {
  const { mutateAsync } = usePasswordRecovery();

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema,
    onSubmit: async (values, _formik) => {
      try {
        await mutateAsync(values);
        onConfirm();
      } finally {
        _formik.setTouched({});
        _formik.setSubmitting(false);
      }
    },
  });

  return (
    <Modal onClose={onClose} variant='custom'>
      <FormikProvider value={formik}>
        <Form>
          <StyledWrapperModal>
            <LockCircle />
            <StyledTextWrapper>
              <StyledTitle>Recuperar contraseña</StyledTitle>
              <StyledSubtitle>A continuación, te enviaremos un mail para cambiar tu contraseña.</StyledSubtitle>
            </StyledTextWrapper>
            <StyledInputWrapper>
              <Input label='Correo electrónico' placeholder='ejemplo@wimet.com' type='email' name='email' autoFocus />
            </StyledInputWrapper>
            <StyledButtonsWrapper>
              <Button
                type='submit'
                fullWidth={false}
                disabled={!formik.values.email || Boolean(formik.errors.email) || formik.isSubmitting}>
                Enviar
                {formik.isSubmitting && <LoadingSpinner />}
              </Button>
              <StyledGoBackButton onClick={onClose}>Volver al inicio de sesión</StyledGoBackButton>
            </StyledButtonsWrapper>
          </StyledWrapperModal>
        </Form>
      </FormikProvider>
    </Modal>
  );
};

export default ResetPasswordModalEmailRequest;
