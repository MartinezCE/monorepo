import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Input,
  PasswordInput,
  Text,
  images,
  Link,
  UserRole,
  LoadingModal,
  useWindowPopup,
} from '@wimet/apps-shared';
import Layout from '../../components/UI/Layout';
import useLoginUser, { LoginUserPayload } from '../../hooks/api/Auth/useLoginUser';
import { handleGoogleLogin } from '../../utils/google';
import { EmailRequestModal, SendConfirmation } from '../../components/ResetPasswordModals';

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

const StyledRecoverButton = styled(Button)`
  color: ${({ theme }) => theme.colors.darkGray};
  font-weight: ${({ theme }) => theme.fontWeight[0]};
  margin-top: 8px;
  align-self: flex-end;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.darkGray};
  }
`;

const StyledButtonWrapper = styled.div`
  width: 100%;
  margin-top: 56px;
  display: flex;
  flex-direction: column;
  row-gap: 40px;
`;

const StyledSeparatorWrapper = styled.div`
  width: 100%;
  display: flex;
  column-gap: 26px;
  justify-content: center;
  align-items: center;
`;

const StyledSeparator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray};
`;

const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.gray};
`;

const StyledGoogleButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.orange};
  justify-content: center;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.orange};
    background-color: ${({ theme }) => theme.colors.lightOrange};
  }
`;

const StyledRegisterWrapper = styled.div`
  width: 100%;
  display: flex;
  column-gap: 6px;
  align-items: baseline;
  justify-content: center;
`;

const validationSchema = Yup.object()
  .shape({
    email: Yup.string().trim().required('Este campo es obligatorio').email('El email no es válido'),
    password: Yup.string()
      .trim()
      .required('Este campo es obligatorio')
      .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  })
  .noUnknown();

enum ModalKeys {
  EMAIL_REQUEST = 'EMAIL_REQUEST',
  CONFIRMATION = 'CONFIRMATION',
}

export default function LoginPage() {
  const router = useRouter();
  const { requestResetPassword } = router.query;
  const { mutateAsync } = useLoginUser();
  const [isPopupOpened, setIsPopupOpened] = useState(false);
  const [openModalKey, setOpenModalKey] = useState<ModalKeys | null>(null);
  const [openModalFromQuery, setOpenModalFromQuery] = useState<string | null>(requestResetPassword as string);
  const { openPopup } = useWindowPopup();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    // eslint-disable-next-line consistent-return
    onSubmit: async (values, _formik) => {
      try {
        const user = await mutateAsync(
          validationSchema.cast(values, { stripUnknown: true }) as unknown as LoginUserPayload
        );

        router.replace(`${user.profileUrl}${user.userRole?.value === UserRole.MEMBER ? '/members' : ''}`);
      } finally {
        _formik.setTouched({});
        _formik.setSubmitting(false);
      }
    },
  });

  const handleGoogleSignIn = async () => {
    setIsPopupOpened(true);

    handleGoogleLogin({
      openPopup,
      onClose: () => setIsPopupOpened(false),
      onSuccess: () => router.replace(`${process.env.NEXT_PUBLIC_PARTNERS_URL}`),
    });
  };

  const handleCloseConfirmationModal = useCallback(() => {
    const id = setTimeout(() => {
      setOpenModalKey(null);
      clearTimeout(id);
    }, 3000);
  }, []);

  return (
    <FormikProvider value={formik}>
      <Form>
        <Layout title='Wimet | Login Partner' sidebarTitle='Inicia sesión'>
          <StyledWrapper>
            <StyledInputWrapper>
              <Input label='Correo electrónico' placeholder='ejemplo@wimet.com' type='email' name='email' />
              <PasswordInput label='Contraseña' placeholder='Wimet1234.' name='password' moveSiblingOnError />
            </StyledInputWrapper>
            <StyledRecoverButton variant='six' noBackground onClick={() => setOpenModalKey(ModalKeys.EMAIL_REQUEST)}>
              ¿Olvidaste tu contraseña?
            </StyledRecoverButton>
            <StyledButtonWrapper>
              <Button type='submit'>Iniciar sesión</Button>
              <StyledSeparatorWrapper>
                <StyledSeparator />
                <StyledText>O</StyledText>
                <StyledSeparator />
              </StyledSeparatorWrapper>
              <StyledGoogleButton trailingIcon={<images.GoogleLogo />} onClick={handleGoogleSignIn}>
                Iniciar sesión con G Suite
              </StyledGoogleButton>
              <StyledRegisterWrapper>
                <Text>¿Todavía no tienes cuenta?</Text>
                <Link href='/' variant='secondary' noBackground>
                  Registrate aquí
                </Link>
              </StyledRegisterWrapper>
            </StyledButtonWrapper>
          </StyledWrapper>
        </Layout>
      </Form>
      {isPopupOpened && <LoadingModal />}
      {(openModalKey === ModalKeys.EMAIL_REQUEST || openModalFromQuery) && (
        <EmailRequestModal
          onClose={() => {
            setOpenModalKey(null);
            setOpenModalFromQuery(null);
          }}
          onConfirm={() => {
            setOpenModalKey(ModalKeys.CONFIRMATION);
            setOpenModalFromQuery(null);
            handleCloseConfirmationModal();
          }}
        />
      )}
      {openModalKey === ModalKeys.CONFIRMATION && <SendConfirmation />}
    </FormikProvider>
  );
}
