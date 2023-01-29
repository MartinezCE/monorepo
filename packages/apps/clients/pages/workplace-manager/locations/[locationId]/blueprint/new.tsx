import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import { FormikProvider, useFormik } from 'formik';
import { ClientLocation } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';
import Layout from '../../../../../components/Layout';
import AddBlueprintsStep from '../../../../../components/EditLocationPage/AddBlueprintsStep';
import useGetClientLocation, { getLocation, GET_CLIENT_LOCATION } from '../../../../../hooks/api/useGetClientLocation';

export default function LocationEditPage() {
  const router = useRouter();
  const { data: locationData = {} as Partial<ClientLocation> } = useGetClientLocation(
    router.query.locationId as string
  );

  const formik = useFormik({
    initialValues: {
      name: locationData.name || '',
      floor: '',
    },
    onSubmit: () => {},
  });

  return (
    <Layout>
      <FormikProvider value={formik}>
        <AddBlueprintsStep />
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
