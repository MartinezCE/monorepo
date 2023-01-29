import { useRouter } from 'next/router';
import { useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import styled from 'styled-components';
import { FormikProvider, useFormik } from 'formik';
import { dehydrate, QueryClient } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { BackLink, StepFormLayout, TitleEditable, useValidatedSetStep } from '@wimet/apps-shared';
import Layout from '../../../../components/UI/Layout';
import useCreateSpaces from '../../../../hooks/api/useCreateSpace';
import { getReservationType, GET_RESERVATION_TYPE } from '../../../../hooks/api/useGetReservationType';
import { schemas, validationSchemas } from '../../../../components/LocationNewSpacePage/Steps';
import UploadMainInformation from '../../../../components/LocationPage/UploadMainInformation';
import useGetLocation from '../../../../hooks/api/useGetLocation';

const StyledHeaderWrapper = styled.div`
  > div:last-child {
    margin-top: 12px;
  }
`;

const initialValues = {
  name: 'Sala de Reunión 1',
  spaceReservationTypeId: 1,
  area: '',
  spaceTypeId: 1,
  peopleCapacity: '',
};

export type NewSpaceInitialValues = typeof initialValues;

export default function LocationNewSpacePage() {
  // TODO: Use "useStep" hook with a custom prop to disable the skip step by url
  const [step, setStep] = useState(0);
  const router = useRouter();
  const { locationId } = router.query;
  const { mutateAsync, isLoading } = useCreateSpaces({
    onSuccess: data => {
      const { id: spaceId } = data as { id: number };
      router.push(`/locations/${locationId}/spaces/${spaceId}/edit?step=1`);
    },
  });

  const { data: locationData = {} } = useGetLocation(locationId as string);

  const steps = [
    {
      id: 0,
      label: 'Datos',
      component: <UploadMainInformation />,
    },
    {
      id: 1,
      label: 'Imágenes',
    },
    {
      id: 2,
      label: 'Amenities',
    },
    {
      id: 3,
      label: 'Precio y Términos',
    },
    {
      id: 4,
      label: 'Disponibilidad',
    },
  ];

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchemas[step],
    onSubmit: async (values, _formik) => {
      if (step !== 0) return;
      try {
        const castedData = schemas.cast(values, { stripUnknown: true });
        await mutateAsync({
          locationId: locationId as string,
          ...castedData,
          spaceReservationTypeId: castedData.spaceReservationTypeId ?? initialValues.spaceReservationTypeId,
          spaceTypeId: castedData.spaceTypeId ?? initialValues.spaceTypeId,
        });
      } finally {
        _formik.setTouched({});
        _formik.setSubmitting(false);
      }
    },
  });

  const validatedSetStep = useValidatedSetStep({ formik, stepsLength: steps.length, setStep });

  return (
    <Layout>
      <FormikProvider value={formik}>
        <StepFormLayout
          customHeader={
            <StyledHeaderWrapper>
              <BackLink href={`/locations/${locationId}`}>
                {locationData?.name} {locationData?.streetName}
              </BackLink>
              <TitleEditable names={['name']} />
            </StyledHeaderWrapper>
          }
          steps={steps}
          current={step}
          onPreviousClick={() => validatedSetStep(step - 1)}
          onClickLeftButton={() => router.push('/locations')}
          leftButtonText='Ir a Locaciones'
          nextButtonDisabled={isLoading}>
          {step === 0 && steps[step].component}
        </StepFormLayout>
      </FormikProvider>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(GET_RESERVATION_TYPE, () =>
      getReservationType(context.req.headers as AxiosRequestHeaders)
    ),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
