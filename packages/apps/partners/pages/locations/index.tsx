import styled from 'styled-components';
import { DeleteBaseModal, images, Link, LocationBox, useGetMe, useModal, useRemoveLocation } from '@wimet/apps-shared';
import Layout from '../../components/UI/Layout';
import useGetAllLocations, { GET_ALL_LOCATIONS } from '../../hooks/api/useGetAllLocations';

const StyledWrapper = styled.div`
  padding: 96px 0;
  padding-left: 75px;
`;

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 494px);
  gap: 33px;
  margin-top: 61px;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default function LocationsPage() {
  const { data: user } = useGetMe();
  const { data = [] } = useGetAllLocations(user?.companies[0].id, {
    staleTime: 0,
    select: _data => _data.map(el => ({ ...el, percentage: Number(el.percentage) })),
  });
  const { handleOpenModal, handleCloseModal, removeItem, modalType } = useModal<'remove', typeof data[number]>();
  const { mutate } = useRemoveLocation();

  return (
    <Layout>
      <StyledWrapper>
        <StyledHeader>
          <h6>Tus locaciones</h6>
          <Link trailingIcon={<images.TinyMore />} href='/locations/new'>
            Cargar locación
          </Link>
        </StyledHeader>
        <StyledContainer>
          {data.map(item => (
            <LocationBox
              id={item.id}
              status={item.status}
              locationFiles={item.locationFiles}
              address={item.address}
              percentage={item.percentage}
              spaceCount={item.spaceCount}
              key={item.id}
              editHref={`/locations/${item.id}/edit`}
              completeInfoHref={`/locations/${item.id}/edit`}
              name={item.name}
              onDelete={() => handleOpenModal('remove', item)}
            />
          ))}
        </StyledContainer>
        {modalType === 'remove' && (
          <DeleteBaseModal
            title='¿Eliminar locación?'
            onCancel={handleCloseModal}
            onClose={handleCloseModal}
            onConfirm={() => {
              if (!removeItem) return;
              mutate({ id: removeItem.id, queryToInvalidate: GET_ALL_LOCATIONS });
            }}
          />
        )}
      </StyledWrapper>
    </Layout>
  );
}
