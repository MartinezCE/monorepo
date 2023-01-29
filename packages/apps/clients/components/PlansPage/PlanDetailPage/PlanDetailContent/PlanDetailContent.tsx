import { Tab, TabItem } from '@wimet/apps-shared';
import React, { useState } from 'react';
import styled from 'styled-components';
import CollaboratorsTab from './CollaboratorsTab';
import InvoiceTab from './InvoiceTab';
import ReservesTab from './ReservesTab';

const StyledWrapper = styled.div`
  padding: 72px 104px 72px 75px;
`;

const StyledTabsWrapper = styled.div``;

const StyledTab = styled(Tab)`
  & button {
    min-width: 220px;
    margin-right: 8px;
  }
`;

const tabs: TabItem[] = [
  {
    label: 'Colaboradores',
    id: 1,
  },
  {
    label: 'Reservas',
    id: 2,
  },
  {
    label: 'Facturación',
    id: 3,
  },
];

type Props = {
  planId: number;
};

const PlanDetailContent = ({ planId }: Props) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  return (
    <StyledWrapper>
      <StyledTabsWrapper>
        <StyledTab tabs={tabs} active={selectedTab} onChange={newTab => setSelectedTab(newTab)} variant='outline' />
        {selectedTab.id === 1 && <CollaboratorsTab planId={planId} />}
        {selectedTab.id === 2 && <ReservesTab planId={planId} />}
        {selectedTab.id === 3 && <InvoiceTab planId={planId} />}
      </StyledTabsWrapper>
    </StyledWrapper>
  );
};

export default PlanDetailContent;
