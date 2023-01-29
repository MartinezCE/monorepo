import { Modal, Tab, TabItem } from '@wimet/apps-shared';
import React, { useState } from 'react';
import styled from 'styled-components';
import CreateFromEmail from './CreateFromEmail';
import CreateFromXLS from './CreateFromXLS';

const StyledWrappedModal = styled(Modal)`
  height: 100vh;
  width: 100vw;
  background-color: rgb(44 48 56 / 80%) !important;
  > div {
    width: 606px;
    height: 624px;
    background-color: white;
    & > div > button {
      color: ${({ theme }) => theme.colors.darkGray};
    }
  }
`;

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 56px 72px 72px 72px;
`;

const StyledTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StyledSubtitle = styled.div`
  margin-top: 16px;
  font-size: 16px;
  font-weight: 200;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StyledContentWrapper = styled.div`
  margin-top: 56px;
`;

const StyledTab = styled(Tab)`
  justify-content: center;
  margin-bottom: 40px;
  & button {
    width: 50%;
    margin: 0;
  }
`;

export const tabs: TabItem[] = [
  { label: 'Vía email', id: 'email' },
  { label: 'Con planilla .xls', id: 'xls' },
];

type Props = {
  onSubmit: () => void;
  onClickClose?: () => void;
};

const CreateCollaboratorsModal = ({ onClickClose, onSubmit }: Props) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <StyledWrappedModal onClose={onClickClose}>
      <StyledWrapper>
        <StyledTitle>Agregar colaboradores</StyledTitle>
        <StyledSubtitle>Suma colaboradores de tu empresa para agregarlos a tus planes</StyledSubtitle>
        <StyledContentWrapper>
          <StyledTab tabs={tabs} active={selectedTab} onChange={newTab => setSelectedTab(newTab)} variant='outline' />
          {selectedTab.id === 'email' && <CreateFromEmail onClickSubmit={onSubmit} onClickCancel={onClickClose} />}
          {selectedTab.id === 'xls' && <CreateFromXLS onClickSubmit={onSubmit} onClickCancel={onClickClose} />}
        </StyledContentWrapper>
      </StyledWrapper>
    </StyledWrappedModal>
  );
};

export default CreateCollaboratorsModal;
