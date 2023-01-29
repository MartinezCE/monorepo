import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from 'react-query';
import { Form, FormikProvider, useFormik } from 'formik';
import {
  BaseHeaderTitle,
  Button,
  images,
  LoadingSpinner,
  mergeSchemas,
  SelectLocationSection,
  useGetMe,
} from '@wimet/apps-shared';
import * as Yup from 'yup';
import styled from 'styled-components';
import Layout from '../../../components/Layout';
import useCreateLocation, { CreateLocationPayload } from '../../../hooks/api/useCreateLocation';

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
};

export type NewLocationInitialValues = typeof initialValues;

const validationSchemas = [
  Yup.object().shape({
    name: Yup.string().required('Nombre requerido').min(8),
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
    city: Yup.string(),
    country: Yup.string(),
    state: Yup.string(),
    postalCode: Yup.string(),
    streetName: Yup.string(),
    streetNumber: Yup.string(),
    stateId: Yup.number(),
  }),
  Yup.object(),
];

const StyledWrapper = styled(Form)`
  padding: 72px 75px;
  padding-right: 0;
  flex-direction: column;
  display: flex;
  width: 100%;
  height: 100%;
  row-gap: 50px;
`;

const StyledBtnContainer = styled.div`
  margin-top: auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const IconHouse = styled(images.House)`
  width: 20px;
  height: 20px;
`;

const schemas = mergeSchemas(validationSchemas);

export default function LocationNewPage() {
  const router = useRouter();
  const { data: user } = useGetMe();
  const { mutateAsync } = useCreateLocation(user?.companies[0].id || -1);

  const formik = useFormik({
    initialValues: { ...initialValues },
    // eslint-disable-next-line consistent-return
    validationSchema: validationSchemas[0],
    onSubmit: async ({ location, ...values }, _formik) => {
      try {
        const newLocation = await mutateAsync({
          ...schemas.cast(values, { stripUnknown: true }),
          latitude: location.lat,
          longitude: location.lng,
        } as CreateLocationPayload);
        return await router.push(`/workplace-manager/locations/${newLocation.id}/blueprint/new`);
      } finally {
        _formik.setTouched({});
        _formik.setSubmitting(false);
      }
    },
  });

  const handleBackClick = () => router.push('/workplace-manager/locations');

  return (
    <Layout>
      <FormikProvider value={formik}>
        <StyledWrapper>
          <BaseHeaderTitle primaryText='Agrega una loacación' />
          <SelectLocationSection hideDescription />
          <StyledBtnContainer>
            <Button variant='outline' trailingIcon={<IconHouse />} onClick={handleBackClick}>
              Ir a Locaciones
            </Button>
            <Button
              type='submit'
              trailingIcon={formik.isSubmitting ? <LoadingSpinner /> : undefined}
              disabled={formik.isSubmitting}>
              Siguiente
            </Button>
          </StyledBtnContainer>
        </StyledWrapper>
      </FormikProvider>
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
