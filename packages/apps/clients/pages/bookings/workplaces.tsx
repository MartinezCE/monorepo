/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  BookingsStatusLabels,
  BookingStatus,
  Button,
  EmptyState,
  images,
  Tab,
  TabItem,
  WPMReservation,
} from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';
import { useRouter } from 'next/router';
import { FormikProvider, useFormik } from 'formik';
import { GetServerSidePropsContext } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import styled from 'styled-components';
import { formatInTimeZone } from 'date-fns-tz';
import { isPassedDate, orderReservationsByDate } from '../../utils/date';
import Layout from '../../components/Layout';
import { getReservations, GET_RESERVATIONS, useGetReservations } from '../../hooks/api/useGetReservations';
import CustomTable from '../../components/CustomTable';
import { TypeData } from '../../components/CustomTable/CustomTableRow';
import useCancelReservation from '../../hooks/api/useCreateCheckIn';

enum TabsIds {
  ACTIVE = 1,
  PASSED = 2,
}

const StyledWrapper = styled.div`
  padding: 72px 0px 90px 75px;
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  .left {
    margin-left: 2rem;
    border: 1px solid #d0d5dd;
    padding: 10px 16px;
    font-size: 14px;
    border-end-start-radius: 8px;
    border-start-start-radius: 8px;
    cursor: pointer;
  }
  .right {
    border: 1px solid #d0d5dd;
    padding: 10px 16px;
    font-size: 14px;
    border-start-end-radius: 8px;
    border-end-end-radius: 8px;
    margin-left: 0px;
    cursor: pointer;
  }
  .active {
    background-color: #d0d5dd;
  }
`;

const StyledTab = styled(Tab)`
  margin-top: 3rem;
  & button {
    min-width: 72px;
    margin-right: 48px;
  }
`;

const tabs: TabItem[] = [
  { label: 'Activas', id: TabsIds.ACTIVE },
  { label: 'Pasadas', id: TabsIds.PASSED },
];

export default function BookingWPMsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [reservationSelected, setReservationSelected] = useState<WPMReservation[]>([]);
  const { data: allReservations = [] } = useGetReservations();
  const { mutateAsync: cancelReservation } = useCancelReservation();
  const formik = useFormik({
    initialValues: { searchValue: '' },
    onSubmit: () => {},
  });

  const activeReservations = useMemo(() => {
    const res = allReservations.filter(r => !isPassedDate(r.startAt, r.destinationTz));
    return orderReservationsByDate(res, 'asc');
  }, [allReservations]);

  const passedReservations = useMemo(() => {
    const res = allReservations.filter(r => isPassedDate(r.startAt, r.destinationTz));
    return orderReservationsByDate(res, 'desc');
  }, [allReservations, allReservations]);

  useEffect(() => {
    if (activeTab.id === TabsIds.ACTIVE) {
      setReservationSelected(activeReservations);
    } else {
      setReservationSelected(passedReservations);
    }
  }, [activeTab]);

  const parsedUsersForTable = useMemo(
    () =>
      reservationSelected?.map(reservation => [
        {
          variant: 'avatar',
          title: `${reservation.user?.firstName} ${reservation.user?.lastName}`,
          subtitle: reservation.user?.email,
        },
        { variant: 'text', text: formatInTimeZone(reservation.startAt, reservation.destinationTz, 'dd-MM-yyyy') },
        { variant: 'text', text: reservation.WPMReservationType?.name },
        { variant: 'text', text: reservation.seat?.name },
        { variant: 'text', text: reservation.seat?.blueprint?.floor.number },
        {
          variant: 'chip',
          text: BookingsStatusLabels[reservation.status as keyof typeof BookingsStatusLabels],
          type: reservation.status === BookingStatus.DONE ? 'success' : 'alert',
        },
        {
          variant: 'custom',
          children: (
            <Button
              disabled={reservation.status === BookingStatus.CANCEL}
              variant='transparent'
              leadingIcon={<images.TinyBin />}
              onClick={() => cancelReservation(reservation.id.toString())}
            />
          ),
        },
      ]) as unknown as TypeData[][],
    [reservationSelected]
  );

  const handlerWpmActive = () => {
    router.push('/bookings');
  };

  const handleChangeTab = (newTab: TabItem) => {
    setActiveTab(newTab);
    formik.setFieldValue('searchValue', '');
  };

  return (
    <Layout>
      <FormikProvider value={formik}>
        <StyledWrapper>
          <HeaderTitle>
            <h6>Reservas</h6>
            <div>
              <span className='left' onClick={handlerWpmActive}>
                Marketplace
              </span>
              <span className='right active'>Mis Oficinas</span>
            </div>
          </HeaderTitle>
          <div>
            <StyledTab tabs={tabs} active={activeTab} onChange={handleChangeTab} variant='outline' />
          </div>
          {parsedUsersForTable.length > 0 ? (
            <CustomTable
              headers={['Nombre', 'Fecha', 'Tipo', 'Espacio', 'Piso', 'Estado', 'Acciones']}
              data={parsedUsersForTable}
            />
          ) : (
            <EmptyState
              title='No tienes reservas activas en este momento'
              subtitle='No pierdas tiempo, realiza una reserva'
            />
          )}
        </StyledWrapper>
      </FormikProvider>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(GET_RESERVATIONS, () => getReservations(context.req.headers as AxiosRequestHeaders));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
