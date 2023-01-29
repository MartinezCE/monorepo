/* eslint-disable no-extra-boolean-cast */
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { toDate } from 'date-fns-tz';
import { format } from 'date-fns';

import { SquarePill, EmptyState, SpaceReservationHourlyTypes } from '@wimet/apps-shared';
import TeamPageLayout from '../../../../components/TeamsPage/TeamPageLayout';
import TeamCreditsBanner from '../../../../components/TeamsPage/components/TeamCreditsBanner';
import BuyCreditsModal from '../../../../components/TeamsPage/components/BuyCreditsModal';
import GeneralStatusCard from '../../../../components/TeamsPage/components/GeneralStatusCard';
import useGetCompanyTeam from '../../../../hooks/api/useGetCompanyTeam';
import useGetPlanReservations from '../../../../hooks/api/useGetPlanReservations';
import CustomTable from '../../../../components/CustomTable';
import { TypeData } from '../../../../components/CustomTable/CustomTableRow';
import { isPassedDate } from '../../../../utils/date';
import useGetPlanUsers from '../../../../hooks/api/useGetPlanUsers';

const Title = styled.p`
  font-size: 1.3em;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StatusCardsContainer = styled.div`
  display: flex;
  justify-content: 'space-between';
  column-gap: 22px;
`;

const TeamGeneralPage = () => {
  const router = useRouter();

  const [showLoadCreditsModal, setShowLoadCreditsModal] = useState<boolean>(false);
  const { data: team = [] } = useGetCompanyTeam(router.query.teamId as string);
  const { data: reservations = [] } = useGetPlanReservations(router.query.teamId as string);
  const { data: planCollaborators = [] } = useGetPlanUsers(router.query.teamId as string);

  const parsedReservationsForTable = useMemo(
    () =>
      reservations
        .filter(r => !isPassedDate(r.startDate, r.destinationTz))
        .map(r => [
          { variant: 'avatar', title: `${r?.user?.firstName} ${r?.user?.lastName}`, subtitle: r?.user?.email },
          { variant: 'text', text: format(toDate(r?.startDate), 'dd-MM-yyyy') },
          { variant: 'text', text: r?.space?.location.name },
          { variant: 'text', text: r?.space?.name },
        ]) as unknown as TypeData[][],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reservations]
  );

  const calculateTotal = () =>
    reservations.reduce((acc, val) => {
      if (val.type === SpaceReservationHourlyTypes.DAYPASS) {
        return acc + Number(val.hourlySpaceHistory?.fullDayPrice);
      }
      return acc + Number(val.hourlySpaceHistory?.halfDayPrice);
    }, 0);

  return (
    <>
      <TeamCreditsBanner
        leftComponent={<SquarePill>{team?.planCredit?.value || 0}</SquarePill>}
        title='Créditos disponibles'
        description='Puedes pre-comprar créditos con descuentos por cantidad.'
        btnText='Cargar créditos'
        onClick={() => setShowLoadCreditsModal(true)}
        hideAction={!!team?.planCredit?.value}
      />

      <StatusCardsContainer>
        <GeneralStatusCard
          title='Colaboradores'
          info={planCollaborators.length.toString()}
          // status={{ type: 'success' as StatusTypes, percentage: 40, text: 'vs last month' }}
        />
        <GeneralStatusCard
          title='Reservas realizadas'
          info={reservations.length.toString()}
          // status={{ type: 'error' as StatusTypes, percentage: 70, text: 'vs last month' }}
        />
        <GeneralStatusCard
          title='Gasto Total'
          info={`$ ${calculateTotal()}`}
          // status={{ type: 'success' as StatusTypes, percentage: 20, text: 'vs last month' }}
        />
      </StatusCardsContainer>

      <Title>Próximas reservas</Title>

      {!!parsedReservationsForTable.length ? (
        <CustomTable headers={['Nombre', 'Fecha', 'Piso/Planta', 'Posición']} data={parsedReservationsForTable} />
      ) : (
        <EmptyState
          title='No hay próximas reservas'
          subtitle='Podrás ver las reservas de tus colaboradores con información básica y estado.'
        />
      )}

      {showLoadCreditsModal && (
        <BuyCreditsModal onClose={() => setShowLoadCreditsModal(false)} teamId={router.query.teamId as string} />
      )}
    </>
  );
};

TeamGeneralPage.getLayout = (page: React.ReactElement) => <TeamPageLayout>{page}</TeamPageLayout>;

export default TeamGeneralPage;
