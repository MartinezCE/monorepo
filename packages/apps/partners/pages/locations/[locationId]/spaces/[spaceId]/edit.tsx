import { GetServerSidePropsContext } from 'next';
import { useMemo } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { FormikProvider, useFormik } from 'formik';
import {
  BackLink,
  BlockInfo,
  StepFormLayout,
  TitleEditable,
  useStep,
  AmenityType,
  useValidatedSetStep,
  SpaceReservationType,
  Amenity,
  Location,
  Space,
} from '@wimet/apps-shared';
import styled from 'styled-components';
import Layout from '../../../../../components/UI/Layout';
import { getAmenities, GET_AMENITIES } from '../../../../../hooks/api/useGetAmenities';
import useGetLocation, { getLocation, GET_LOCATION } from '../../../../../hooks/api/useGetLocation';
import useGetSpace, { getSpace, GET_SPACE } from '../../../../../hooks/api/useGetSpace';
import { schemas, validationSchemas } from '../../../../../components/LocationEditSpacePage/Steps';
import { getSpaceDiscounts, GET_SPACE_DISCOUNTS } from '../../../../../hooks/api/useGetSpaceDiscounts';
import { getSpaceDeposits, GET_SPACE_DEPOSITS } from '../../../../../hooks/api/useGetSpaceDeposits';
import { getReservationType, GET_RESERVATION_TYPE } from '../../../../../hooks/api/useGetReservationType';
import UploadMainInformation from '../../../../../components/LocationPage/UploadMainInformation';
import UploadSpaceImagesSection from '../../../../../components/LocationEditSpacePage/UploadSpaceImagesSection/UploadSpaceImagesSection';
import { SelectSpaceAmenitiesSection } from '../../../../../components/common';
import PriceAndTermsSection from '../../../../../components/LocationEditSpacePage/PriceAndTermsSection/PriceAndTermsSection';
import { SelectAvailabilitySection } from '../../../../../components/LocationNewSpacePage';
import useUpdateSpace from '../../../../../hooks/api/useUpdateSpace';

const initialValues = {
  name: '',
  spaceOfferId: 1,
  area: '',
  spaceTypeId: 1,
  peopleCapacity: '',
  spaceReservationType: SpaceReservationType.HOURLY,
  spaceReservationTypeId: 1,
  schedule: [] as {
    openTime: string;
    closeTime: string;
    dayOfWeek: number;
    is24Open: boolean;
  }[],
  hourly: null as
    | {
        price: number;
        halfDayPrice: number;
        fullDayPrice: number;
        minHoursAmount: number;
        dayOfWeek: number;
      }[]
    | null,
  monthly: {
    price: '',
    minMonthsAmount: 1,
    maxMonthsAmount: 12,
    spaceDepositId: null as number | null,
    spaceDiscounts: null as
      | {
          percentage: number;
          spaceDiscountId: number;
        }[]
      | null,
  },
  tourUrl: '',
  imageQuantity: 0,
  amenities: [] as Amenity[],
};

export type EditSpaceInitialValues = typeof initialValues;

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

export default function LocationEditSpacePage() {
  const steps = [
    {
      id: 0,
      label: 'Datos',
      component: <UploadMainInformation />,
    },
    {
      id: 1,
      label: 'Imágenes',
      component: (
        <UploadSpaceImagesSection description='Podés incluir fotos específicas del espacio. Debes subir un mínimo de 4 y un máximo de 10 imágenes. El orden en el que las cargues será igual a como aparecerá en la publicación.' />
      ),
      sidebarChildren: RightInfo,
    },
    {
      id: 2,
      label: 'Amenities',
      component: (
        <SelectSpaceAmenitiesSection description='Incluye todos beneficios que den valor agregado a los espacios.' />
      ),
      sidebarChildren: RightInfo,
    },
    {
      id: 3,
      label: 'Precio y Términos',
      component: <PriceAndTermsSection />,
      sidebarChildren: RightInfo,
    },
    {
      id: 4,
      label: 'Disponibilidad',
      title: '',
      component: (
        <SelectAvailabilitySection description='Puedes establecer tus horarios de disponibilidad por día. No se aceptarán reservas en horarios bloqueados.' />
      ),
      sidebarChildren: RightInfo,
    },
  ];

  const { router, step, isLastStep } = useStep({ limit: steps.length - 1, defaultShallow: true });
  const { data: locationData = {} as Partial<Location> } = useGetLocation(router.query.locationId as string);
  const { data: spaceData = {} as Partial<Space> } = useGetSpace(router.query.spaceId as string, {
    select: _data => ({
      ..._data,
      spaceReservationType: _data.spaceReservationType?.value,
      imageQuantity: _data.spaceFiles?.images?.length || 0,
      amenities: Object.values(_data.spacesAmenities || {}).reduce((acc, amenity) => {
        acc = acc.concat(amenity.map(({ id, name, isDefault }) => ({ id, name, isDefault }))); // eslint-disable-line no-param-reassign
        return acc;
      }, [] as { id: number; name: string; isDefault: boolean }[]),
      monthly: {
        ..._data.monthly,
        spaceDiscounts: _data.monthly?.spaceDiscounts?.length
          ? _data.monthly?.spaceDiscounts?.map(({ id, spaceDiscountMonthlySpace }) => ({
              spaceDiscountId: id,
              percentage: Number(spaceDiscountMonthlySpace.percentage) * 100 || '',
            }))
          : null,
        spaceDepositId: _data.monthly?.spaceDeposits?.[0]?.id || null,
      },
      schedule:
        _data.schedule?.map(s => ({
          ...s,
          openTime: s.openTime?.match(/\d{2}:\d{2}/)?.[0] || '',
          closeTime: s.closeTime?.match(/\d{2}:\d{2}/)?.[0] || '',
        })) || [],
    }),
  });

  const { mutateAsync } = useUpdateSpace(Number(router.query.spaceId), {
    onSuccess: () => {
      if (!isLastStep) return step.goForwardStep(1);
      return router.push(`/locations/${router.query.locationId}`);
    },
  });

  const castedData = useMemo(() => schemas.cast(spaceData, { stripUnknown: true }), [spaceData]);

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      ...castedData,
      monthly: { ...initialValues.monthly, ...castedData.monthly },
      schedule: spaceData?.schedule || [],
      hourly: spaceData.hourly || [],
    },
    validationSchema: validationSchemas[step.current],
    // eslint-disable-next-line consistent-return
    onSubmit: async (values, _formik) => {
      try {
        const casted = schemas.cast(values, { stripUnknown: true });

        await mutateAsync({
          ...casted,
          spaceOfferId: casted.spaceOfferId || 1,
          tourUrl: casted.tourUrl || null,
          amenities: casted.amenities?.map(({ id }) => id),
          schedule: values.schedule || [],
          hourly: values.hourly,
          monthly: {
            ...casted.monthly,
            spaceDiscounts: casted.monthly?.spaceDiscounts?.map(discount => ({
              ...discount,
              percentage: (discount?.percentage ?? 0) / 100,
            })),
          },
        });
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
          onClickLeftButton={() => router.push(`/locations/${router.query.locationId}`)}
          leftButtonText='Ir a Locaciones'
          nextButtonDisabled={formik.isSubmitting}
          customHeader={
            <div>
              <StyledBackLink href={`/locations/${router.query.locationId}`}>
                {locationData.name} {locationData.streetName}
              </StyledBackLink>
              <TitleEditable names={['name']} />
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
  const locationId = context.query.locationId as string;
  const spaceId = context.query.spaceId as string;

  await Promise.all([
    queryClient.prefetchQuery([GET_LOCATION, locationId], () =>
      getLocation(locationId, context.req.headers as AxiosRequestHeaders)
    ),
    queryClient.prefetchQuery([GET_SPACE, spaceId], () =>
      getSpace(spaceId, context.req.headers as AxiosRequestHeaders)
    ),
    queryClient.prefetchQuery(GET_RESERVATION_TYPE, () =>
      getReservationType(context.req.headers as AxiosRequestHeaders)
    ),
    queryClient.prefetchQuery([GET_AMENITIES, [AmenityType.SPACE]], () => getAmenities([AmenityType.SPACE])),
    queryClient.prefetchQuery(GET_SPACE_DISCOUNTS, () => getSpaceDiscounts(context.req.headers as AxiosRequestHeaders)),
    queryClient.prefetchQuery(GET_SPACE_DEPOSITS, () => getSpaceDeposits(context.req.headers as AxiosRequestHeaders)),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
