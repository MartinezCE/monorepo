import { Button, images, Input, Label, LoadingSpinner, PasswordInput } from '@wimet/apps-shared';
import styled from 'styled-components';
import Layout from '../../UI/Layout';

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 73px;
  padding-left: 73px;
  padding-bottom: 68px;
`;

const StyledInputGrid = styled.div`
  margin-top: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 40px;
  row-gap: 32px;

  & > * {
    flex-shrink: 0;
    min-height: 0;
    min-width: 0;
  }
`;

const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 56px;
`;

const StyledGoogleButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.orange};

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.orange};
    background-color: ${({ theme }) => theme.colors.lightOrange};
  }
`;

const StyledButtonWrapper = styled.div`
  height: 100%;
  margin-top: 32px;
  display: flex;
  align-items: flex-end;
`;

const StyledButton = styled(Button)`
  width: fit-content;
  margin-left: auto;
`;

type Props = {
  isSubmitting?: boolean;
  onGoogleSignIn?: () => void;
};

export default function AddContactStep({ isSubmitting, onGoogleSignIn }: Props) {
  return (
    <Layout
      title='Wimet | Register Partner'
      sidebarTitle='Quiero publicar mi espacio'
      sidebarDescription='Todos los espacios necesitarán tener un responsable que pueda administrar la información que se compartirá con los usuarios.'>
      <StyledWrapper>
        <Label text='Datos de contacto' variant='tertiary' size='xlarge' lowercase />
        <StyledInputGrid>
          <Input label='Nombre' placeholder='Tu nombre' name='firstName' />
          <Input label='Apellido' placeholder='Tu apellido' name='lastName' />
          <PasswordInput label='Contraseña' placeholder='Ingresa una contraseña segura.' name='password' />
          <PasswordInput
            label='Repetir contraseña'
            placeholder='La contraseña debe coinicidir.'
            name='repeatPassword'
          />
          <Input label='Teléfono' placeholder='Ingresa tu número de contacto.' type='tel' name='phoneNumber' />
          <Input label='Correo electrónico' placeholder='Ingresa tu email de empresa' type='email' name='email' />
        </StyledInputGrid>
        <StyledRow>
          <StyledGoogleButton trailingIcon={<images.GoogleLogo />} onClick={onGoogleSignIn}>
            Registrarme con G Suite
          </StyledGoogleButton>
          {/* <Switch label='Quiero apoyo comercial' checked /> */}
        </StyledRow>
        <StyledButtonWrapper>
          <StyledButton
            type='submit'
            disabled={isSubmitting}
            trailingIcon={isSubmitting ? <LoadingSpinner /> : undefined}>
            Enviar
          </StyledButton>
        </StyledButtonWrapper>
      </StyledWrapper>
    </Layout>
  );
}
