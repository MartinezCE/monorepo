/* eslint-disable jsx-a11y/anchor-is-valid */
import { useRouter } from 'next/router';
import { useState } from 'react';
import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';
import styled from 'styled-components';
import {
  Button,
  Checkbox,
  ClientInvitationToken,
  Input,
  LoadingSpinner,
  PasswordInput,
  Text,
} from '@wimet/apps-shared';
import { dehydrate, QueryClient } from 'react-query';
import { GetServerSidePropsContext } from 'next/types';
import jwt from 'jsonwebtoken';
import Layout from '../../components/UI/Layout';
import AddAvatar from '../../components/UI/AddAvatar';
import FeedbackRegisterModal from '../../components/common/FeedbackRegisterModal';
import useGetCompany, { getCompany, GET_COMPANY } from '../../hooks/api/Company/useGetCompany';
import useCreateUser from '../../hooks/api/Auth/useCreateUser';

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 62px;
  padding-left: 73px;
  padding-bottom: 68px;
`;

const StyledFormHeader = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

const StyledFormTitleContainer = styled.div`
  margin-left: 32px;
`;

const StyledTitle = styled.h6`
  font-size: 20px;
`;

const StyledInputGrid = styled.div`
  margin-top: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 40px;
  row-gap: 32px;
`;

const StyledRow = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
`;

const StyledCheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 12px;
`;

const StyledCheckbox = styled(Checkbox)`
  color: ${({ theme }) => theme.colors.blue};
  border: 2px solid ${({ theme }) => theme.colors.blue};
`;

const StyledText = styled(Text)`
  a {
    color: ${({ theme }) => theme.colors.blue};
    text-decoration: none;
  }
`;

const StyledModalTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 10px;
  width: 429px;
`;

const StyledModalTitle = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes[5]};
  line-height: ${({ theme }) => theme.lineHeights[3]};
  font-weight: ${({ theme }) => theme.fontWeight[1]};
`;

const StyledModalText = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  font-size: 20px;
  line-height: 28px;
  font-weight: ${({ theme }) => theme.fontWeight[0]};
`;

const validationSchema = Yup.object().shape({
  firstName: Yup.string().trim().required('Este campo es obligatorio').min(1),
  lastName: Yup.string().trim().required('Este campo es obligatorio').min(1),
  password: Yup.string()
    .trim()
    .required('Este campo es obligatorio')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  repeatPassword: Yup.string()
    .trim()
    .required('Este campo es obligatorio')
    .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir'),
  terms: Yup.boolean().oneOf([true], 'Debes aceptar los términos y condiciones'),
});

type Props = {
  companyId: number;
};

export default function ConfirmInvitationPage({ companyId }: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const { data: company } = useGetCompany(companyId);
  const { mutateAsync } = useCreateUser('clients', {
    onSuccess: () => setShowModal(true),
  });

  const formik = useFormik({
    initialValues: { firstName: '', lastName: '', password: '', repeatPassword: '', terms: false },
    validationSchema,
    onSubmit: async (values, _formik) => {
      try {
        const { repeatPassword, terms, ...payload } = validationSchema.cast(values, { stripUnknown: true });

        await mutateAsync({
          ...payload,
          token: router.query.token as string,
        });

        setShowModal(true);
      } finally {
        _formik.setTouched({});
        _formik.setSubmitting(false);
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <Form>
        <Layout
          title='Wimet | Confirm register invitation'
          sidebarTitle='Te damos la bienvenida a Wimet'
          sidebarDescription='Completa los datos para terminar de registrarte y ¡comienza a trabajar desde donde quieras!'>
          <StyledWrapper>
            <StyledFormHeader>
              <AddAvatar color='member' />
              <StyledFormTitleContainer>
                <StyledTitle>¡Hola{formik.values.firstName.trim() ? ` ${formik.values.firstName}` : ''}!</StyledTitle>
                <Text variant='large'>Fuiste invitado como miembro de {company?.name}</Text>
              </StyledFormTitleContainer>
            </StyledFormHeader>
            <StyledInputGrid>
              <Input label='Nombre' placeholder='Tu nombre' name='firstName' />
              <Input label='Apellido' placeholder='Tu apellido' name='lastName' />
              <PasswordInput label='Contraseña' placeholder='Ingresa una contraseña segura.' name='password' />
              <PasswordInput label='Repetir contraseña' name='repeatPassword' />
            </StyledInputGrid>
            <StyledRow>
              <StyledCheckboxWrapper>
                <StyledCheckbox name='terms' onChange={formik.handleChange} />
                <StyledText variant='large'>
                  Acepto los <a href='#'>Términos y Condiciones</a> y <a href='#'>Políticas de Privacidad</a>
                </StyledText>
              </StyledCheckboxWrapper>
              <Button
                type='submit'
                disabled={formik.isSubmitting || !formik.values.terms}
                trailingIcon={formik.isSubmitting ? <LoadingSpinner /> : undefined}>
                Registrate
              </Button>
            </StyledRow>
          </StyledWrapper>
        </Layout>
        {showModal && (
          <FeedbackRegisterModal
            onClose={() => router.replace(`${process.env.NEXT_PUBLIC_CLIENTS_URL}`)}
            onFinish={() => router.replace(`${process.env.NEXT_PUBLIC_CLIENTS_URL}`)}
            buttonText='Ir a Inicio'>
            <StyledModalTextWrapper>
              <StyledModalTitle>
                ¡Listo!
                <br />
                Ya eres parte de Wimet
              </StyledModalTitle>
              <StyledModalText>Ya puedes empezar a reservar espacios donde quieras</StyledModalText>
            </StyledModalTextWrapper>
          </FeedbackRegisterModal>
        )}
      </Form>
    </FormikProvider>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  const { query } = context;
  const { token } = query;
  let decoded: Partial<ClientInvitationToken> | null = null;

  try {
    decoded = jwt.decode(token as string, { json: true });

    const { companyId } = decoded as ClientInvitationToken;
    const company = await queryClient.fetchQuery([GET_COMPANY, companyId], () => getCompany(companyId));

    if (!company) throw new Error('Invalid token');
  } catch (_) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  return {
    props: {
      ...decoded,
      dehydratedState: dehydrate(queryClient),
    },
  };
}
