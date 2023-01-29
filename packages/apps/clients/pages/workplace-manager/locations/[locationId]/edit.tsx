import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { GetServerSidePropsContext } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import { FormikProvider, useFormik } from 'formik';
import {
  ClientLocation,
  mergeSchemas,
  SelectLocationSection,
  StepFormLayout,
  useGetMe,
  useStep,
  useValidatedSetStep,
  emptyStringKeyToNull,
  nullKeyToEmptyString,
  Floor,
} from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';
import * as Yup from 'yup';
import Layout from '../../../../components/Layout';
import useGetClientLocation, { getLocation, GET_CLIENT_LOCATION } from '../../../../hooks/api/useGetClientLocation';
import useUpdateLocation, { UpdateLocationPayload } from '../../../../hooks/api/useUpdateLocation';

const SelectSeatsSection = dynamic(() => import('../../../../components/WorkplaceManagerPage/SelectSeatsSection'), {
  ssr: false,
});

const initialValues = {
  name: '',
  address: '',
  city: '',
  country: '',
  state: '',
  postalCode: '',
  streetName: '',
  streetNumber: '',
  isAddressValid: false,
  description: '',
  stateId: 1,
  location: { lat: -34.56, lng: -58.46 },
  tourUrl: '',
  imageQuantity: 0,
  accessCode: '',
  comments: '',
  fallbackInput: '', // TODO: Find a way to use input without using formik
  floors: [] as Floor[],
};

export type EditLocationInitialValues = typeof initialValues;

const validationSchemas = [
  Yup.object().shape({
    name: Yup.string().required('Nombre requerido'),
    address: Yup.string()
      .trim()
      .required('Dirección válida requerida')
      .when('isAddressValid', {
        is: false,
        then: Yup.string().test({
          message: 'Seleccione una dirección válida de la lista de sugerencias',
          test: () => false,
        }),
      }),
    city: Yup.string().nullable(),
    country: Yup.string().nullable(),
    state: Yup.string(),
    postalCode: Yup.string(),
    streetName: Yup.string().nullable(),
    streetNumber: Yup.string().nullable(),
    stateId: Yup.number().nullable(),
  }),
  Yup.object().shape({
    floors: Yup.array().of(
      Yup.object().shape({
        number: Yup.string()
          .nullable()
          .when('blueprints', {
            is: (blueprints?: []) => !!blueprints?.length,
            then: Yup.string().nullable().required('Número de piso requerido'),
          }),
        blueprints: Yup.array().of(Yup.object()),
      })
    ),
  }),
  Yup.object(),
];

const schemas = mergeSchemas(validationSchemas);

export default function LocationEditPage() {
  const { data: user } = useGetMe();
  const router = useRouter();
  const { data: locationData = {} as Partial<ClientLocation> } = useGetClientLocation(
    router.query.locationId as string,
    { select: _data => ({ ..._data, imageQuantity: _data.locationFiles?.images?.length || 0 }) }
  );

  const steps = [
    {
      id: 0,
      label: 'Datos',
      title: 'Datos de la locación',
      // Before: component: <SelectLocationSection countryId={user?.companies[0].state.countryId} />,
      component: <SelectLocationSection hideDescription />,
    },
    {
      id: 2,
      label: 'Disponibilidad',
      title: '',
      component: <SelectSeatsSection section='Planos' />,
    },
  ];

  const { step, isLastStep } = useStep({ limit: steps.length - 1, defaultShallow: true });
  const { mutateAsync } = useUpdateLocation(Number(router.query.locationId));

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...initialValues,
      ...schemas.cast(locationData, { stripUnknown: true }),
      location: {
        lat: Number(locationData.latitude),
        lng: Number(locationData.longitude),
      },
      isAddressValid: !!locationData.address,
      floors: nullKeyToEmptyString(locationData?.floors || []),
    },
    validationSchema: validationSchemas[step.current],
    onSubmit: async ({ location, ...values }, _formik) => {
      try {
        await mutateAsync({
          ...values,
          // @ts-ignore
          floors: emptyStringKeyToNull(values?.floors || []),
          companyId: user?.companies[0].id,
          latitude: location.lat,
          longitude: location.lng,
          tourUrl: values.tourUrl || null,
          accessCode: values.accessCode || null,
          comments: values.comments || null,
        } as UpdateLocationPayload);

        if (formik.status?.manualSubmitting) return true;
        if (!isLastStep) return await step.goForwardStep(1);
        return await router.push('/workplace-manager/locations');
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
          hideSteps
          steps={steps}
          current={step.current}
          onPreviousClick={() => validatedSetStep(step.current - 1)}
          onSetActive={validatedSetStep}
          onClickLeftButton={() => router.push('/workplace-manager/locations')}
          leftButtonText='Ir a Locaciones'
          // hideButtons={step.current === 2}
          nextButtonDisabled={formik.isSubmitting}
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

  await queryClient.prefetchQuery([GET_CLIENT_LOCATION, locationId], () =>
    getLocation(locationId, context.req.headers as AxiosRequestHeaders)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
