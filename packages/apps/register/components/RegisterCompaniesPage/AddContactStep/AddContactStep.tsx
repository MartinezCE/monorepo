import {
  Button,
  images,
  Input,
  Label,
  LoadingSpinner,
  PasswordInput,
  Select,
  // Switch,
  TitleEditable,
} from '@wimet/apps-shared';
import styled from 'styled-components';
import AddAvatar from '../../UI/AddAvatar';
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

const FormHeader = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

const StyledInputGrid = styled.div`
  margin-top: 48px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 40px;
  row-gap: 32px;
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

const FormTitleContainer = styled.div`
  margin-left: 32px;
`;

const TopHeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledBackButton = styled(Button)`
  border-radius: 4px;
  padding: 4px;
`;

const CompanyRoleOptions = [
  {
    value: 'People / HR',
    label: 'People / HR',
  },
  {
    value: 'Finanzas',
    label: 'Finanzas',
  },
  {
    value: 'CEO / Founder / Partner',
    label: 'CEO / Founder / Partner',
  },
  {
    value: 'Otro',
    label: 'Otro',
  },
];

type Props = {
  isSubmitting?: boolean;
  onGoogleSignIn?: () => void;
  onBackClick: () => void;
};

export default function AddContactStep({ isSubmitting, onGoogleSignIn, onBackClick }: Props) {
  return (
    <Layout
      title='Wimet | Contact Register'
      sidebarTitle='Registra tus datos'
      sidebarDescription='Vamos a necesitar que nos compartas tus datos'>
      <StyledWrapper>
        <TopHeaderRow>
          <Label text='Mis datos' variant='tertiary' size='xlarge' lowercase />
          <StyledBackButton variant='secondary' leadingIcon={<images.ChevronLeft />} onClick={onBackClick} />
        </TopHeaderRow>
        <FormHeader>
          <AddAvatar color='client' />
          <FormTitleContainer>
            <TitleEditable
              names={['firstName', 'lastName']}
              placeholders={['Nombre', 'Apellido']}
              buttonVariant='secondary'
              buttonLeftSeparation={24}
            />
          </FormTitleContainer>
        </FormHeader>
        <StyledInputGrid>
          <PasswordInput label='Contraseña' placeholder='Ingresa una contraseña segura.' name='password' />
          <PasswordInput
            label='Repetir contraseña'
            placeholder='La contraseña debe coinicidir.'
            name='repeatPassword'
          />
          <Input label='Teléfono' placeholder='Ingresa tu número de contacto.' name='phoneNumber' />
          <Input label='Correo electrónico' placeholder='Ingresa tu email de empresa' name='email' />
          <Select
            label='Area / Departamento'
            options={CompanyRoleOptions}
            placeholder={CompanyRoleOptions[0].label}
            instanceId='companyRoleOptions'
            name='companyRole'
          />
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
