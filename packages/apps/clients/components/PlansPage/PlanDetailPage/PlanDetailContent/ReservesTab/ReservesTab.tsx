import { Tab, TabItem } from '@wimet/apps-shared';
import React, { useState } from 'react';
import styled from 'styled-components';
import useGetPlanReservations from '../../../../../hooks/api/useGetPlanReservations';
import NoData from '../NoData';
import ReservesTable from './ReservesTable';

const StyledWrapper = styled.div`
  margin-top: 48px;
`;

const StyledTab = styled(Tab)`
  & button {
    min-width: 46px;
    margin-right: 35px;
  }
`;

const tabs: TabItem[] = [
  {
    label: 'Todas',
    id: 1,
  },
  // {
  //   label: 'Pasadas',
  //   id: 2,
  // },
];

type Props = {
  planId: number;
};

const ReservesTab = ({ planId }: Props) => {
  const { data = [] } = useGetPlanReservations(planId);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <>
      {!data.length ? (
        <StyledWrapper>
          <NoData title='Aún no hay reservas hechas' />
        </StyledWrapper>
      ) : (
        <StyledWrapper>
          <StyledTab tabs={tabs} active={selectedTab} onChange={newTab => setSelectedTab(newTab)} variant='outline' />
          {selectedTab.id === 1 && <ReservesTable reservations={data} />}
          {selectedTab.id === 2 && <ReservesTable reservations={data} />}
        </StyledWrapper>
      )}
    </>
  );
};

export default ReservesTab;
