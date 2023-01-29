import styled, { useTheme } from 'styled-components';
import { Text, BlockInfo as CommonBlockInfo, images, Link } from '@wimet/apps-shared';
import Layout from '../components/UI/Layout';
import RegisterBox from '../components/UI/RegisterBox';

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 100px 106px;
  padding-right: 0;
`;

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, max-content);
  gap: 40px;
  padding-bottom: 16px;
`;

const StyledCompanyRegister = styled.div`
  background-color: ${({ theme }) => theme.colors.extraLightBlue};
  grid-area: 1 / 1 / 2 / 3;
  padding: 38px 56px 48px;
  border-radius: 8px;
  min-height: 202px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledCompanyRegisterInfo = styled.div`
  max-width: 325px;
`;

const Title = styled(Text)`
  font-weight: ${({ theme }) => theme.fontWeight[3]};
  margin: 9px 0 8px;
`;

const IconArrowRight = styled(images.ArrowRight)`
  width: 20px;
  height: 20px;
`;

const RegisterLink = styled(Link)`
  column-gap: 8px;
  margin-top: 10px;
  border: 1px solid transparent;
  &:hover {
    border-color: ${({ theme }) => theme.colors.blue};
  }
`;

const BlockInfo = styled(CommonBlockInfo)`
  max-width: 381px;
`;

const StyledLoginWrapper = styled.div`
  margin-top: 56px;
  display: flex;
  column-gap: 6px;
  align-items: baseline;
`;

const IndexPage = () => {
  const theme = useTheme();
  return (
    <Layout title='Wimet | Register' sidebarTitle='Regístrate'>
      <StyledWrapper>
        <StyledContainer>
          <StyledCompanyRegister>
            <StyledCompanyRegisterInfo>
              <images.Briefcase />
              <Title variant='large'>Cuenta como empresa</Title>
              <Text variant='large'>Sumá tu compañía a la red de espacios que cambió la forma de trabajo remoto.</Text>
            </StyledCompanyRegisterInfo>
            <RegisterLink href='/register/clients'>
              Registra tu empresa
              <IconArrowRight />
            </RegisterLink>
          </StyledCompanyRegister>
          <RegisterBox
            title='Cuenta como miembro'
            linkText='Quiero ingresar como empleado'
            borderColor={theme.colors.sky}
            url='/'
          />
          <RegisterBox
            title='Cuenta como partner'
            linkText='Quiero publicar mi espacio'
            borderColor={theme.colors.orange}
            url='/register/partners'
          />
        </StyledContainer>
        <BlockInfo>
          Si eres miembro de una empresa asociada debes solicitar la invitación y esperar el email de confirmación.
        </BlockInfo>
        <StyledLoginWrapper>
          <Text>¿Ya estás registrado?</Text>
          <Link href='/login/partners' variant='secondary' noBackground>
            Ingresa aquí
          </Link>
        </StyledLoginWrapper>
      </StyledWrapper>
    </Layout>
  );
};

export default IndexPage;
