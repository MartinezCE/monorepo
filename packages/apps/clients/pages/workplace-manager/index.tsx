import { Text, images, Label, Link } from '@wimet/apps-shared';
import styled, { css } from 'styled-components';
import Layout from '../../components/Layout';

const StyledWrapper = styled.div`
  margin-top: 6%;
  margin-left: 8%;
`;
const HeaderDescription = styled.div`
  margin-top: 4%;
  margin-bottom: 6%;
`;

const StyledCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  padding-top: 3%;
  padding-left: 6%;
  border-radius: 6px;
  margin-right: 2%;
  width: 33%;
  padding-bottom: 2%;
`;

const TextCard = styled(Text)`
  margin-bottom: 4%;
`;

const StyledLabel = styled(Label)`
  margin-bottom: 4%;
`;

const CardsWrapper = styled.div`
  display: flex;
  margin-bottom: 10%;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const StyledLink = styled(Link)`
  display: flex;
  width: 28%;
  margin-bottom: 1%;
`;

const MixinIcons = css`
  color: ${({ theme }) => theme.colors.blue};
`;

const StyledMore = styled(images.More)`
  ${MixinIcons}
`;

const StyledWorkplace = styled(images.Workplace)`
  ${MixinIcons}
`;

const StyledCalendar = styled(images.Calendar)`
  ${MixinIcons}
`;

const StyledText = styled(Text)`
  font-size: 16px;
  margin-bottom: 16px;
`;

export default function Index() {
  return (
    <Layout>
      <StyledWrapper>
        <h6>Workplace Manager</h6>
        <HeaderDescription>
          <Text>Reserva tu espacio a los miembros de tu empresa.</Text>
          <Text>Administra tus oficinas de forma simple.</Text>
        </HeaderDescription>
        <CardsWrapper>
          <StyledCard>
            <StyledLabel text='1.' variant='currentColor' size='large' />
            <StyledLabel text='Carga los planos' variant='currentColor' size='large' lowercase />
            <TextCard>de tus espacios</TextCard>
            <StyledWorkplace />
          </StyledCard>
          <StyledCard>
            <StyledLabel text='2.' variant='currentColor' size='large' />
            <TextCard>Marca los</TextCard>
            <StyledLabel text='lugares disponibles' variant='currentColor' size='large' lowercase />
            <StyledMore />
          </StyledCard>
          <StyledCard>
            <StyledLabel text='3.' variant='currentColor' size='large' />
            <StyledLabel text='Ten control' variant='currentColor' size='large' lowercase />
            <TextCard>de todas las reservas</TextCard>
            <StyledCalendar />
          </StyledCard>
        </CardsWrapper>
        <ButtonsWrapper>
          <StyledText>Comienza ahora</StyledText>
          <StyledLink href='/workplace-manager/locations/new' variant='primary'>
            Carga una locación
          </StyledLink>
        </ButtonsWrapper>
      </StyledWrapper>
    </Layout>
  );
}
