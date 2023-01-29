import { DotsPattern, Label, LocationStatus, useGetMe } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import styled from 'styled-components';
import Layout from '../components/Layout';
import MembersMenu from '../components/MembersPage/MembersMenu';
import MembersReservationSelect from '../components/MembersPage/MembersReservationSelect';
import { getAllClientLocations, GET_ALL_CLIENT_LOCATIONS } from '../hooks/api/useGetAllClientLocations';

const StyledLayout = styled(Layout)`
  padding-left: 0;

  > aside {
    position: absolute;
    z-index: 0;
  }
`;

const StyledWrapper = styled.div`
  position: relative;
  height: 100%;
`;

const StyledBackgroundWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  padding: 40px;
`;

const StyledImageWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 30vw;
`;

const StyledImage = styled(Image)`
  border-radius: 10px;
`;

const StyledDots = styled(DotsPattern)`
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 1;

  > div {
    background-color: ${({ theme }) => theme.colors.lightOrange};
  }
`;

const StyledRightSide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  margin-left: calc(30vw + 40px);
  padding-left: 105px;
  justify-content: center;

  > p {
    font-size: 24px;
    margin-bottom: 40px;
  }

  > div {
    margin-top: 50px;
  }
`;

const StyledHeader = styled.div`
  margin-top: 20px;
`;

export default function MembersIndex() {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const { data: userData } = useGetMe();
  return (
    <StyledLayout title='Wimet | Members' hideSidebarContent>
      <StyledWrapper>
        <StyledBackgroundWrapper>
          <StyledImageWrapper>
            <StyledImage src='/images/members_home.jpg' layout='fill' objectFit='cover' objectPosition='center' />
          </StyledImageWrapper>
          <StyledDots small />
        </StyledBackgroundWrapper>
        <StyledRightSide>
          <StyledHeader>
            <h6>Hola {userData?.firstName},</h6>
            <p>Te damos la bienvenida a Wimet.</p>
          </StyledHeader>
          <Label text='¿Dónde te gustaría reservar un espacio?' lowercase size='xlarge' variant='currentColor' />
          {selectedOption === 'reservation' ? (
            <MembersReservationSelect onCancel={() => setSelectedOption('')} />
          ) : (
            <MembersMenu onOptionClick={setSelectedOption} />
          )}
        </StyledRightSide>
      </StyledWrapper>
    </StyledLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(GET_ALL_CLIENT_LOCATIONS, () =>
    getAllClientLocations(
      { status: LocationStatus.PUBLISHED, floorsRequired: true },
      context.req.headers as AxiosRequestHeaders
    )
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
