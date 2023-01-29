import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import { dehydrate, QueryClient, useQueryClient } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { FormikProvider, useFormik } from 'formik';
import styled from 'styled-components';
import {
  BackLink,
  BaseHeaderTitle,
  BlockInfo,
  SelectLocationSection,
  StepFormLayout,
  useStep,
  AmenityType,
  AccessFormSection,
  useValidatedSetStep,
  UploadLocationImagesSection,
  Amenity,
  Location,
  LocationAmenity,
} from '@wimet/apps-shared';
import Layout from '../../../components/UI/Layout';
import useGetLocation, { getLocation, GET_LOCATION } from '../../../hooks/api/useGetLocation';
import { getAmenities, GET_AMENITIES } from '../../../hooks/api/useGetAmenities';
import { validationSchemas, schemas } from '../../../components/LocationEditPage/Steps';
import { SelectLocationAmenitiesSection } from '../../../components/common';
import useUpdateLocation, { UpdateLocationPayload } from '../../../hooks/api/useUpdateLocation';

const initialValues = {
  address: '',
  isAddressValid: false,
  description: '',
  location: { lat: -34.56, lng: -58.46 },
  city: '',
  country: '',
  state: '',
  postalCode: '',
  streetName: '',
  streetNumber: '',
  tourUrl: '',
  imageQuantity: 0,
  amenities: [] as Amenity[],
  accessCode: '',
  comments: '',
  name: '',
};

export type EditLocationInitialValues = typeof initialValues;

type StyledBackLinkProps = {
  hidden?: boolean;
};

const StyledBackLink = styled(BackLink)<StyledBackLinkProps>`
  margin-bottom: 12px;
  margin-left: -5px;
  column-gap: 2px;
  visibility: ${props => (props.hidden ? 'hidden' : 'visible')};
`;

const StyledBlockInfo = styled(BlockInfo)`
  max-width: 179px;
  flex-direction: column;
  align-items: flex-start;
  p {
    margin-top: 8px;
  }
`;

const RightInfo = (
  <StyledBlockInfo>
    Luego de cargar la información deberá pasar por un proceso de aceptación antes de ser publicado.
  </StyledBlockInfo>
);

export default function LocationEditPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: locationData = {} as Partial<Location> } = useGetLocation(router.query.locationId as string, {
    select: _data => ({
      ..._data,
      imageQuantity: _data.locationFiles?.images?.length || 0,
      amenities: (_data.locationsAmenities as LocationAmenity[])?.map(({ amenity: { id, name, isDefault } = {} }) => ({
        id,
        name,
        isDefault,
      })),
    }),
  });

  const steps = [
    {
      id: 0,
      label: 'Datos',
      title: '¿Dónde se encuentra la locación?',
      // Before: component: <SelectLocationSection countryId={user?.companies[0].state.countryId} />,
      component: <SelectLocationSection />,
    },
    {
      id: 1,
      label: 'Imágenes',
      component: (
        <UploadLocationImagesSection
          description='Podés incluir fotos específicas del espacio. Debes subir un mínimo de 4 y un máximo de 10 imágenes. El orden en el que las cargues será igual a como aparecerá en la publicación.'
          images={locationData.locationFiles?.images || []}
          queryToInvalidate={GET_LOCATION}
        />
      ),
      sidebarChildren: RightInfo,
    },
    {
      id: 2,
      label: 'Amenities',
      component: (
        <SelectLocationAmenitiesSection description='Incluye todos beneficios que den valor agregado a los espacios comunes dentro de la locación. Por ejemplo, seguridad privada las 24 hs.' />
      ),
      sidebarChildren: RightInfo,
    },
    {
      id: 3,
      label: 'Acceso',
      component: (
        <AccessFormSection description='Si cuentas con un código de acceso al espacio, o comentarios que ayuden a orientar al organizador puedes escribirlos aquí para que sean visibles una vez confirmada la reserva.' />
      ),
      sidebarChildren: RightInfo,
    },
    /*     {
      id: 4,
      label: 'Documentos',
      component: (
        <UploadDocsSection description='Los documentos seleccionados serán accesibles para el cliente antes de confirmar la reserva. Puedes incluir términos y condiciones de tus servicios, espacificaciones técnicas u otro documento.' />
      ),
      sidebarChildren: RightInfo,
    }, */
  ];

  const { step, isLastStep } = useStep({ limit: steps.length - 1, defaultShallow: true });
  const { mutateAsync } = useUpdateLocation(Number(router.query.locationId), {
    onSuccess: response => {
      if (step.current === 0) {
        queryClient.setQueryData([GET_LOCATION, router.query.locationId], oldData => ({
          ...(oldData as Location),
          name: response.name,
        }));
      }
      if (!isLastStep) return step.goForwardStep(1);
      return router.push('/locations');
    },
  });

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      ...schemas.cast(locationData, { stripUnknown: true }),
      location: { lat: Number(locationData.latitude), lng: Number(locationData.longitude) },
      isAddressValid: !!locationData.address,
    },
    validationSchema: validationSchemas[step.current],
    // eslint-disable-next-line consistent-return
    onSubmit: async ({ location, ...values }, _formik) => {
      try {
        const casted = schemas.cast(values, { stripUnknown: true });

        await mutateAsync({
          ...casted,
          latitude: location.lat,
          longitude: location.lng,
          tourUrl: casted.tourUrl || null,
          amenities: casted.amenities?.map(({ id }) => id),
          accessCode: casted.accessCode || null,
          comments: casted.comments || null,
        } as UpdateLocationPayload);
      } finally {
        _formik.setTouched({});
        _formik.setSubmitting(false);
      }
    },
  });

  const validatedSetStep = useValidatedSetStep({ formik, stepsLength: steps.length, setStep: step.goToStep });

  return (
    <Layout>
      <FormikProvider value={formik}>
        <StepFormLayout
          steps={steps}
          current={step.current}
          onPreviousClick={() => validatedSetStep(step.current - 1)}
          onSetActive={validatedSetStep}
          onClickLeftButton={() => router.push('/locations')}
          leftButtonText='Ir a Locaciones'
          nextButtonDisabled={formik.isSubmitting}
          customHeader={
            <div>
              <StyledBackLink href='/locations' hidden={!step.current}>
                Locaciones
              </StyledBackLink>
              <BaseHeaderTitle
                primaryText={!step.current ? steps[step.current].title : locationData.name}
                secondaryText={step.current ? formik.values.address.split(',')[0] : undefined}
              />
            </div>
          }
          showFinishButton={isLastStep}>
          {steps[step.current].component}
        </StepFormLayout>
      </FormikProvider>
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
    queryClient.prefetchQuery([GET_AMENITIES, [AmenityType.LOCATION, AmenityType.SAFETY]], () =>
      getAmenities([AmenityType.LOCATION, AmenityType.SAFETY])
    ),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
