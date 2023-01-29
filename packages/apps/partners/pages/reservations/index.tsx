import { SpaceReservationsTable, ReservationTableLayout, reservationTabs, useGetMe } from '@wimet/apps-shared';
import { FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import Layout from '../../components/UI/Layout';
import useGetReservations from '../../hooks/api/useGetReservations';

const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState(reservationTabs[0]);
  const { data: userData } = useGetMe();
  const { data = [] } = useGetReservations(Number(userData?.companies[0].id));
  const formik = useFormik({ initialValues: {}, onSubmit: () => {} });

  return (
    <Layout>
      <FormikProvider value={formik}>
        <ReservationTableLayout activeTab={activeTab} onChangeTab={newTab => setActiveTab(newTab)}>
          <SpaceReservationsTable reservations={data} hiddenColumns={['spaceType', 'credits']} />
        </ReservationTableLayout>
      </FormikProvider>
    </Layout>
  );
};

export default BookingsPage;
