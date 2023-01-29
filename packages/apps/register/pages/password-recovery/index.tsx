import { useState } from 'react';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { Form, FormikProvider, useFormik } from 'formik';
import styled from 'styled-components';
import { Button, PasswordInput, UserRole } from '@wimet/apps-shared';
import useResetPassword, { ResetPasswordPayload } from '../../hooks/api/Auth/useResetPassword';
import Layout from '../../components/UI/Layout';
import ChangeSuccess from '../../components/ResetPasswordModals/ChangeSuccess';

const StyledWrapper = styled.div`
  width: 365px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 73px 0;
  margin: auto;
`;

const StyledInputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 32px;
`;

const StyledButtonWrapper = styled.div`
  width: 100%;
  margin-top: 56px;
  display: flex;
  flex-direction: column;
  row-gap: 40px;
`;

const StyledCounterText = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 400;
  font-size: 16px;
  margin-top: 30px;
  max-width: 180px;
  align-self: center;
  text-align: center;
`;

const validationSchema = Yup.object({
  password: Yup.string()
    .trim()
    .required('Este campo es obligatorio')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  passwordRepeat: Yup.string()
    .trim()
    .required('Este campo es obligatorio')
    .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden'),
});

export default function LoginPage() {
  const router = useRouter();
  const { token } = router.query;
  const { mutateAsync } = useResetPassword();
  const [countdown, setCountdown] = useState(5);
  const [passwordChangedSuccess, setPasswordChangedSuccess] = useState(false);

  const formik = useFormik({
    initialValues: { password: '', passwordRepeat: '' },
    validationSchema,
    onSubmit: async (values, _formik) => {
      try {
        const user = await mutateAsync({ ...values, token } as ResetPasswordPayload);
        setPasswordChangedSuccess(true);

        await new Promise<void>(resolve => {
          const intervalId = setInterval(() => setCountdown(prev => prev - 1), 1000);
          const timeoutId = setTimeout(() => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            resolve();
          }, 5000);
        });

        router.replace(`${user.profileUrl}${user.userRole?.value === UserRole.MEMBER ? '/members' : ''}`);
      } finally {
        _formik.setTouched({});
        _formik.setSubmitting(false);
      }
    },
  });

  const submitIsDisabled =
    Boolean(formik.errors.password) ||
    Boolean(formik.errors.passwordRepeat) ||
    !formik.values.password ||
    !formik.values.passwordRepeat;

  return (
    <FormikProvider value={formik}>
      <Form>
        <Layout title='Wimet | Recuperar contraseña' sidebarTitle='Recuperar contraseña'>
          <StyledWrapper>
            <StyledInputWrapper>
              <PasswordInput label='Contraseña' placeholder='Wimet1234.' name='password' moveSiblingOnError />
              <PasswordInput
                label='Repetir contraseña'
                placeholder='Wimet1234.'
                name='passwordRepeat'
                moveSiblingOnError
              />
            </StyledInputWrapper>
            <StyledButtonWrapper>
              <Button type='submit' disabled={submitIsDisabled}>
                Enviar
              </Button>
            </StyledButtonWrapper>
          </StyledWrapper>
        </Layout>
      </Form>
      {passwordChangedSuccess && (
        <ChangeSuccess>
          <StyledCounterText>Rediccionamiento automático en {countdown}</StyledCounterText>
        </ChangeSuccess>
      )}
    </FormikProvider>
  );
}
