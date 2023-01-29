import { Button, useGetMe, DeleteBaseModal, useModal, useRemoveLocation, HeaderHero } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import styled from 'styled-components';
import Layout from '../../../components/Layout';
import LocationBoxClient from '../../../components/LocationBox/LocationBoxClient';
import PendingLocationModal from '../../../components/WorkplaceManagerPage/PendingLocationModal';
import useGetAllClientLocations, {
  getAllClientLocations,
  GET_ALL_CLIENT_LOCATIONS,
} from '../../../hooks/api/useGetAllClientLocations';

import banner from '../../../public/images/image_locations.png';

const StyledWrapper = styled.div`
  margin-top: 5%;
  margin-left: 5%;
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 2em;
  & > div {
    display: flex;
    flex-direction: column;
    width: 50%;
  }
  & > div:nth-child(2) {
    align-items: flex-end;
  }
`;

const StyledCardsGrid = styled.div`
  margin-top: 5%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 494px);
  column-gap: 40px;
  row-gap: 32px;
  align-items: flex-start;
`;

const title = (
  <>
    La libertad de poder trabajar <br /> desde cualquier lugar
  </>
);
const description = (
  <>
    Conoce los beneficios de tener Wimet <br /> para tu equipo y cómo funciona.
  </>
);

const WorkplaceManagerLocationsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { data: user } = useGetMe();
  const { data = [] } = useGetAllClientLocations();
  const userCanCreateLocations = user?.isWPMEnabled || !data?.length;
  const handleModalButtonClick = () => setShowModal(false);
  const handleButtonClick = () => {
    if (!userCanCreateLocations) return setShowModal(true);
    return router.push('/workplace-manager/locations/new');
  };

  const { handleOpenModal, handleCloseModal, removeItem, modalType } = useModal<'remove', typeof data[number]>();
  const { mutate } = useRemoveLocation();
  const onClickQr = (id: number) => {
    window.open(`${process.env.NEXT_PUBLIC_INDEX_URL}/qr/${id}`, '_blank');
  };
  return (
    <Layout>
      <StyledWrapper>
        {data?.length === 0 && (
          <HeaderHero
            title={title}
            description={description}
            banner={banner}
            // eslint-disable-next-line no-console
            handleClick={handleButtonClick}
          />
        )}
        <StyledHeader>
          <div>
            <h6>Tus locaciones</h6>
          </div>
          <div>
            <Button onClick={handleButtonClick} style={{ width: '40%' }}>
              Crear una locación
            </Button>
          </div>
        </StyledHeader>
        <StyledCardsGrid>
          {(data || []).map(location => (
            <LocationBoxClient
              key={location.id}
              id={location.id}
              status={location.status}
              locationFiles={location.locationFiles}
              name={location.name}
              address={location.address}
              percentage={Number(location.percentage)}
              editHref={`/workplace-manager/locations/${location.id}/edit?step=0`}
              completeInfoHref={`/workplace-manager/locations/${location.id}/edit`}
              showCardHref={userCanCreateLocations}
              cardHref={`/workplace-manager/locations/${location.id}`}
              cardHrefTitle='Ver planos'
              progressPosition='bottom left'
              onDelete={() => handleOpenModal('remove', location)}
              onClickQr={() => onClickQr(location.id)}
              locationFloor={location.floors}
            />
          ))}
        </StyledCardsGrid>
      </StyledWrapper>
      {showModal && (
        <PendingLocationModal onClickAccept={handleModalButtonClick} onClickClose={handleModalButtonClick} />
      )}
      {modalType === 'remove' && (
        <DeleteBaseModal
          title='¿Eliminar locación?'
          onCancel={handleCloseModal}
          onClose={handleCloseModal}
          onConfirm={() => {
            if (!removeItem) return;
            mutate({ id: removeItem.id, queryToInvalidate: GET_ALL_CLIENT_LOCATIONS });
          }}
        />
      )}
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(GET_ALL_CLIENT_LOCATIONS, () =>
    getAllClientLocations({}, context.req.headers as AxiosRequestHeaders)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default WorkplaceManagerLocationsPage;
