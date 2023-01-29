import { BaseHeaderTitle, images, LoadingModal, useWindowPopup, useGetMe } from '@wimet/apps-shared';
import { FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import styled from 'styled-components';
import router from 'next/router';
import Layout from '../../../components/Layout';
import { handleGoogleLogin } from '../../../utils/google';

const StyledWrapper = styled.div`
  width: 494px;
  display: flex;
  flex-direction: column;
  margin: 72px;
`;

const StyledDescription = styled.p`
  display: flex;
  font-size: 14px;
  font-weight: 400;
  margin: 48px 0px;
`;

const StyledCard = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 32px;
  box-shadow: 0px 20px 50px rgba(44, 48, 56, 0.12);
  border-radius: 8px;
  cursor: pointer;
`;
const StyledCardHeader = styled.div`
  display: flex;
  align-items: center;
`;
const StyledCardTitle = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.darkGray};
  font-weight: 500;
  margin-left: 1em;
`;
const StyledCardSubtitle = styled.div`
  margin-top: 8px;
  font-size: 14px;
  font-weight: 200;
  line-height: 20px;
  margin-bottom: 70px;
`;

export default function Integrations() {
  const [isPopupOpened, setIsPopupOpened] = useState(false);
  const { openPopup } = useWindowPopup();
  const { data: userData } = useGetMe();

  const formik = useFormik({
    initialValues: { searchValue: '' },
    onSubmit: () => {},
  });

  const handlerSyncGoogle = async () => {
    setIsPopupOpened(true);

    handleGoogleLogin({
      openPopup,
      onClose: () => setIsPopupOpened(false),
      onSuccess: () => router.replace('/company/integrations/google'),
    });
  };

  return (
    <Layout>
      <FormikProvider value={formik}>
        <StyledWrapper>
          <BaseHeaderTitle primaryText='Integraciones' />
          <StyledDescription>
            Reserva tu espacio a los miembros de tu empresa. Administra tus oficinas de forma simple.
          </StyledDescription>

          <StyledCard onClick={handlerSyncGoogle}>
            <StyledCardHeader>
              <images.GoogleCalendar />
              <StyledCardTitle>
                {userData?.authProviders ? `${userData?.email} cuenta de google` : 'Conectar Google Calendar'}
              </StyledCardTitle>
            </StyledCardHeader>
            <StyledCardSubtitle>
              {userData?.authProviders
                ? 'Sincronice nuevas salas desde Google Calendar.'
                : 'Reserva salas e invita a tus colaboradores desde Google Calendar.'}
            </StyledCardSubtitle>
          </StyledCard>
        </StyledWrapper>
        {isPopupOpened && <LoadingModal />}
      </FormikProvider>
    </Layout>
  );
}

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
