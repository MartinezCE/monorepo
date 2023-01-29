import { ReservationTableLayout, SpaceReservationsTable, TabItem } from '@wimet/apps-shared';
import { FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import useGetMyReservations from '../../../hooks/api/useGetMyReservations';
import useGetMyWPMReservations from '../../../hooks/api/useGetMyWPMReservations copy';
import BookingsTable from '../../BookingsTable';

enum Tabs {
  WORKSPACES = 1,
  WIMETPASS = 2,
}

const tabs: TabItem[] = [
  { label: 'Workspaces', id: Tabs.WORKSPACES },
  { label: 'WimetPass', id: Tabs.WIMETPASS },
];

export default function MemberBookings() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const { data: reservations = [] } = useGetMyReservations();
  const { data: wpmReservations = [] } = useGetMyWPMReservations();
  const formik = useFormik({ initialValues: {}, onSubmit: () => {} });

  // return <BookingsCalendar dates={BOOKINGS_DATES} />;
  return (
    <FormikProvider value={formik}>
      <ReservationTableLayout tabs={tabs} activeTab={activeTab} onChangeTab={newTab => setActiveTab(newTab)}>
        {activeTab.id === Tabs.WORKSPACES && (
          <BookingsTable reservations={wpmReservations} hiddenColumns={['user', 'actions']} />
        )}
        {activeTab.id === Tabs.WIMETPASS && (
          <SpaceReservationsTable reservations={reservations} hiddenColumns={['user', 'spaceName', 'endDate']} />
        )}
      </ReservationTableLayout>
    </FormikProvider>
  );
}
