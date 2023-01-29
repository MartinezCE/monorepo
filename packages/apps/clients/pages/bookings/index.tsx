/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  EmptyState,
  HourlySpaceReservation,
  SpaceReservationHourlyLabels,
  SpaceReservationHourlyTypes,
  Tab,
  TabItem,
  useGetMe,
} from '@wimet/apps-shared';
import { FormikProvider, useFormik } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { formatInTimeZone } from 'date-fns-tz';
import { useRouter } from 'next/router';
import { isPassedDate, orderReservationWSPsByDate } from '../../utils/date';
import Layout from '../../components/Layout';
import CustomTable from '../../components/CustomTable';
import { TypeData } from '../../components/CustomTable/CustomTableRow';
import useGetReservationsHourly from '../../hooks/api/useGetReservationsHourly';

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

export default function BookingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const { data: userData } = useGetMe();
  const { data: reservationWorkspaces = [] } = useGetReservationsHourly(Number(userData?.companies[0].id));
  const [reservationSelected, setReservationSelected] = useState<HourlySpaceReservation[]>([]);
  const formik = useFormik({
    initialValues: { searchValue: '' },
    onSubmit: () => {},
  });

  const activeReservations = useMemo(() => {
    const res = reservationWorkspaces.filter(r => !isPassedDate(r.startDate, r.destinationTz));
    return orderReservationWSPsByDate(res, 'asc');
  }, [reservationWorkspaces]);

  const passedReservations = useMemo(() => {
    const res = reservationWorkspaces.filter(r => isPassedDate(r.startDate, r.destinationTz));
    return orderReservationWSPsByDate(res, 'desc');
  }, [reservationWorkspaces]);

  const calculateTotal = (val: HourlySpaceReservation) => {
    if (val.type === SpaceReservationHourlyTypes.DAYPASS) {
      return Number(val.hourlySpaceHistory?.fullDayPrice);
    }
    return Number(val.hourlySpaceHistory?.halfDayPrice);
  };

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
        { variant: 'text', text: formatInTimeZone(reservation.startDate, reservation.destinationTz, 'dd-MM-yyyy') },
        { variant: 'text', text: SpaceReservationHourlyLabels[reservation.type] },
        { variant: 'text', text: reservation.space.location.name },
        { variant: 'text', text: reservation.space.name },
        { variant: 'text', text: `$ ${calculateTotal(reservation)}` },
        // {
        //   variant: 'chip',
        //   text: BookingsStatusLabels[reservation. as keyof typeof BookingsStatusLabels],
        //   type: reservation.status === BookingStatus.DONE ? 'success' : 'alert',
        // },
      ]) as unknown as TypeData[][],
    [reservationSelected]
  );

  const handlerWpmActive = () => {
    router.push('/bookings/workplaces');
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
              <span className='left active'>Marketplace</span>
              <span className='right' onClick={handlerWpmActive}>
                Mis Oficinas
              </span>
            </div>
          </HeaderTitle>
          <div>
            <StyledTab tabs={tabs} active={activeTab} onChange={handleChangeTab} variant='outline' />
          </div>
          {parsedUsersForTable.length > 0 ? (
            <CustomTable headers={['Nombre', 'Fecha', 'Tipo', 'Espacio', 'Piso', 'Valor']} data={parsedUsersForTable} />
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
