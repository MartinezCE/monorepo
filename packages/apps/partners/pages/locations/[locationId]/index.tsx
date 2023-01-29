import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { getSpaceTypeLabel, pluralize, SpaceBaseLayout, DeleteBaseModal, useModal } from '@wimet/apps-shared';
import SpaceCardLayout from '../../../components/SpaceCardLayout';
import Layout from '../../../components/UI/Layout';
import { getLocation, GET_LOCATION } from '../../../hooks/api/useGetLocation';
import useGetAllSpaces, { getAllSpaces, GET_ALL_SPACES } from '../../../hooks/api/useGetAllSpaces';
import { SpacesListItems } from '../../../mocks';
import useRemoveSpace from '../../../hooks/api/useRemoveSpace';
import { LocationPrice } from '../../../components/LocationDetailsPage';

export default function LocationDetailsPage() {
  const { query } = useRouter();
  // const { data: locationData = {} as Partial<Location> & { percentage: number } } = useGetLocation(
  //   query.locationId as string,
  //   { select: _data => ({ ..._data, percentage: Number(_data.percentage) }) }
  // );
  const { data = [] } = useGetAllSpaces(query.locationId as string, {
    select: _data => _data.map(el => ({ ...el, percentage: Number(el.percentage) })),
  });
  const { handleOpenModal, handleCloseModal, removeItem, modalType } = useModal<'remove', typeof data[number]>();
  const { mutate } = useRemoveSpace();

  // const filterOptions = [
  //   { value: 'all', label: 'Todos' },
  //   { value: 'day', label: 'Espacios por hora/día' },
  //   { value: 'month', label: 'Espacios por mes' },
  // ];

  return (
    <Layout>
      <SpaceBaseLayout>
        {data.map(item => (
          <SpaceCardLayout
            key={item.id}
            spaceTitle={item.name}
            image={item.spaceFiles?.images?.[0].url}
            spaceSubtitle={getSpaceTypeLabel(item.spaceType.value)}
            spaceSecondSubtitle={pluralize(item.peopleCapacity || 0, 'persona', true)}
            status={SpacesListItems[1].status}
            statusText={SpacesListItems[1].statusText}
            percentageCompleted={Math.floor(item.percentage * 100)}
            onCompleteInfoHref={`/locations/${query.locationId}/spaces/${item.id}/edit`}
            onShowDetails={() => {}}
            onDuplicate={() => {}}
            onEditHref={`/locations/${query.locationId}/spaces/${item.id}/edit?step=0`}
            onDelete={() => handleOpenModal('remove', item)}>
            <LocationPrice
              price={SpacesListItems[0].price}
              billingPeriod={SpacesListItems[0].billingPeriod}
              minTerm={SpacesListItems[0].minTerm}
            />
          </SpaceCardLayout>
        ))}
        {modalType === 'remove' && (
          <DeleteBaseModal
            title='¿Eliminar espacio?'
            onCancel={handleCloseModal}
            onClose={handleCloseModal}
            onConfirm={() => {
              if (!removeItem) return;
              mutate({ id: removeItem.id, queryToInvalidate: GET_ALL_SPACES });
            }}
          />
        )}
      </SpaceBaseLayout>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  const locationId = Array.isArray(context.query.locationId) ? context.query.locationId[0] : context.query.locationId;

  await Promise.all([
    queryClient.prefetchQuery([GET_LOCATION, locationId], () =>
      getLocation(locationId, context.req.headers as AxiosRequestHeaders)
    ),
    queryClient.prefetchQuery([GET_ALL_SPACES, locationId], () =>
      getAllSpaces(locationId, context.req.headers as AxiosRequestHeaders)
    ),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
