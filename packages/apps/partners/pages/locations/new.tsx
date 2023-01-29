import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import {
  mergeSchemas,
  StepFormLayout,
  getAllSpacesTypes,
  GET_ALL_SPACES_TYPES,
  SelectLocationSection,
  useGetMe,
  useValidatedSetStep,
} from '@wimet/apps-shared';
import { dehydrate, QueryClient } from 'react-query';
import { GetServerSidePropsContext } from 'next';
import { AxiosRequestHeaders } from 'axios';
import Layout from '../../components/UI/Layout';
import { SelectSpaceTypeSection } from '../../components/LocationEditPage';
import Step from '../../types/step';
import useCreateLocation, { CreateLocationPayload } from '../../hooks/api/useCreateLocation';

const initialValues = {
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
  name: '',
};

export type NewLocationInitialValues = typeof initialValues;

const validationSchemas = [
  Yup.object().shape({
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
    description: Yup.string().trim().required('Descripción requerida').min(10, 'Descripción mínima de 10 caracteres'),
    city: Yup.string(),
    country: Yup.string(),
    state: Yup.string(),
    postalCode: Yup.string(),
    streetName: Yup.string(),
    streetNumber: Yup.string(),
    stateId: Yup.number(),
    name: Yup.string().required('Nombre requerido'),
  }),
  Yup.object(),
];

const schemas = mergeSchemas(validationSchemas);

const LocationAddPage = () => {
  // TODO: Use "useStep" hook with a custom prop to disable the skip step by url
  const [step, setStep] = useState(0);
  const router = useRouter();
  const [spacesSelected, setSpacesSelected] = useState<{ spaceTypeId: number; count: number; name: string }[]>();
  const { data: user } = useGetMe();
  const { mutateAsync } = useCreateLocation(user?.companies[0].id || -1, {
    onSuccess: () => router.replace('/locations'),
  });

  const handleChange = ({ id, value, name }: { id: number; value: number; name: string }) => {
    const newSpacesSelected = [...(spacesSelected || [])];
    if (value > 0) {
      const index = newSpacesSelected.findIndex(item => item.spaceTypeId === id);
      if (index >= 0) {
        newSpacesSelected[index].count = value;
      } else {
        newSpacesSelected.push({ spaceTypeId: id, count: value, name });
      }
      setSpacesSelected(newSpacesSelected);
      return;
    }
    setSpacesSelected(newSpacesSelected.filter(item => item.spaceTypeId !== id));
  };

  const steps: Step[] = [
    {
      id: 0,
      label: 'Datos',
      title: '¿Dónde se encuentra la locación?',
      // Before: component: <SelectLocationSection countryId={user?.companies[0].state.countryId} />,
      component: <SelectLocationSection />,
    },
    {
      id: 1,
      label: 'Tipos de espacios',
      title: '¿Qué tipo de espacios deseas publicar?',
      component: <SelectSpaceTypeSection spacesSelected={spacesSelected} onChange={handleChange} />,
    },
  ];

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchemas[step],
    // eslint-disable-next-line consistent-return
    onSubmit: async ({ location, ...values }, _formik) => {
      try {
        if (step < 1) return setStep(step + 1);

        await mutateAsync({
          ...schemas.cast(values, { stripUnknown: true }),
          latitude: location.lat,
          longitude: location.lng,
          spaces: spacesSelected,
        } as CreateLocationPayload);
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
          primaryText={steps[step].title}
          secondaryText={steps[step].secondaryText}
          steps={steps}
          current={step}
          onPreviousClick={() => validatedSetStep(step - 1)}
          onSetActive={validatedSetStep}
          onClickLeftButton={() => router.push('/locations')}
          leftButtonText='Ir a Locaciones'
          nextButtonDisabled={formik.isSubmitting}
          showFinishButton={step === steps.length - 1}>
          {steps[step].component}
        </StepFormLayout>
      </FormikProvider>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(GET_ALL_SPACES_TYPES, () =>
      getAllSpacesTypes(context.req.headers as AxiosRequestHeaders)
    ),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default LocationAddPage;
