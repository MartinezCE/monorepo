import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from 'react-query';
import {
  SpaceBaseLayout,
  DeleteBaseModal,
  useModal,
  Select,
  images,
  Link,
  Button,
  Amenity,
  BlueprintStatus,
  Seat,
  Floor,
} from '@wimet/apps-shared';
import { FormikProvider, useFormik } from 'formik';
import styled from 'styled-components';
import { ButtonIconMixin } from '@wimet/apps-shared/lib/common/mixins';
import { useEffect, useState } from 'react';
import Layout from '../../../../components/Layout';
import useGetClientLocation from '../../../../hooks/api/useGetClientLocation';
import { getLocationBlueprints } from '../../../../utils/location';
import LocationsBlueprintsByFloor from '../../../../components/LocationsBlueprintsByFloor';
import useFilterOptions from '../../../../components/WorkplaceManagerPage/SelectSeatsSection/useFilterOptions';
import useDeleteFloor from '../../../../hooks/api/useDeleteFloor';

const StyledButtonIcon = styled(Button)`
  ${ButtonIconMixin};
`;

const StyledLink = styled(Link)`
  column-gap: 8px;
`;

const StyledWrapper = styled.div`
  display: flex;
  margin-left: 16px;
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: space-around;
  justify-content: space-between;
  align-items: center;
`;

const StyleWrapLeft = styled.div`
  display: flex;
  flex-direction: row;
`;

type BlueprintType = {
  floor: Floor;
  id: number;
  floorId: number;
  name: string;
  url: string;
  mimetype: string;
  key: string;
  status: BlueprintStatus;
  seats?: Seat[] | undefined;
  amenities?: Amenity[] | undefined;
  createdAt: string;
  updatedAt: string;
};
export default function WorkplaceManagerEditLocationsPage() {
  const router = useRouter();
  const { locationId } = router.query;
  const { data: location } = useGetClientLocation(locationId as string);
  const { mutate: onDeleteFloor } = useDeleteFloor(locationId as string);
  const [blueprints, setBlueprints] = useState<BlueprintType[]>([]);
  const { handleOpenModal, handleCloseModal, removeItem, modalType } = useModal<'remove', typeof blueprints[number]>();
  const floors: string[] = [];
  const { currentLocation, handleFilters, locationOptions } = useFilterOptions();

  const formik = useFormik({
    initialValues: {
      locationId: null,
    },
    onSubmit: () => {},
  });

  useEffect(() => {
    setBlueprints(getLocationBlueprints(location));
  }, [location]);

  return (
    <Layout>
      <SpaceBaseLayout backLinkHref='/workplace-manager/locations' backLinkTitle='Locaciones'>
        <StyledHeader>
          <StyleWrapLeft>
            <FormikProvider value={formik}>
              <Select
                name='locationId'
                label=''
                instanceId='locations'
                options={locationOptions}
                value={currentLocation || null}
                onChange={e => handleFilters(e as { value: string }, 'locationId')}
                placeholder='Contract Workplaces Honduras'
              />
            </FormikProvider>
            <StyledWrapper>
              <StyledLink href={`/workplace-manager/locations/${locationId}/edit?step=0`} variant='fourth' noBackground>
                <StyledButtonIcon variant='secondary' leadingIcon={<images.TinyEdit />} onClick={() => {}} />
              </StyledLink>
            </StyledWrapper>
          </StyleWrapLeft>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Button variant='outline' onClick={() => router.push(`/workplace-manager/locations/${locationId}/seats`)}>
              Importar posiciones
              <images.Download />
            </Button>
            <StyledLink
              href={`/workplace-manager/locations/${locationId}//blueprint/new`}
              variant='fourth'
              noBackground>
              <Button style={{ marginLeft: 16, width: 216, height: 46 }}>
                Crear piso
                <images.TinyMore />
              </Button>
            </StyledLink>
          </div>
        </StyledHeader>
        {(blueprints || []).map(value => {
          const blueprintsByFloor = blueprints.filter(item => item.floor.number === value.floor.number);
          if (!floors.find(item => item === value.floor.number)) {
            floors.push(value.floor.number);
            return (
              <LocationsBlueprintsByFloor
                blueprints={blueprintsByFloor}
                locationId={locationId as string}
                onDelete={blueprint => handleOpenModal('remove', blueprint)}
              />
            );
          }
          return <></>;
        })}
        {modalType === 'remove' && (
          <DeleteBaseModal
            title='¿Eliminar plano?'
            onCancel={handleCloseModal}
            onClose={handleCloseModal}
            onConfirm={async () => {
              if (!removeItem) return;
              await onDeleteFloor(removeItem.floorId.toString());
            }}
          />
        )}
      </SpaceBaseLayout>
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
