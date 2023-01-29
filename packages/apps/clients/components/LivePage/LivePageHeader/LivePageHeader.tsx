import { Tab, TabItem } from '@wimet/apps-shared';
import React from 'react';
import styled from 'styled-components';
import DatesPillList from '../../DatesPillList';
import DatePickerPopup from '../../ReservesPage/ReservesPageHeader/DatePickerPopup';

const StyledWrapper = styled.div`
  display: flex;
  margin-top: 48px;
`;

const StyledTab = styled(Tab)`
  width: auto;
  & button {
    width: 150px;
    padding-bottom: 8px !important;
    margin-right: 0px;
  }
`;

export const liveTabs: TabItem[] = [
  { label: 'Locación', id: 'location' },
  { label: 'Mapa', id: 'map' },
];

type Props = {
  active: TabItem;
  onChange: (value: TabItem) => void;
};

const LivePageHeader = ({ onChange, active }: Props) => (
  <StyledWrapper>
    <StyledTab tabs={liveTabs} active={active || liveTabs[0]} onChange={onChange} variant='outline' />
    <DatesPillList dates={[]} />
    <DatePickerPopup />
  </StyledWrapper>
);

export default LivePageHeader;
