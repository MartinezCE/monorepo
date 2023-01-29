import React from 'react';
import styled from 'styled-components';
import { images } from '../../assets';
import { TabItem } from '../../types';
import FiltersButton from '../FiltersButton';
import Input from '../Input';
import Tab from '../Tab';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 72px 75px;
  gap: 40px;

  > div:first-of-type {
    display: flex;
    gap: 40px;
  }
`;

const StyledTab = styled(Tab)`
  & button {
    min-width: 72px;
    margin-right: 48px;
  }
`;

const StyledFilters = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  > div:first-child {
    width: 250px;
    > div > svg {
      width: 28px;
      margin-top: 10px;
      margin-left: 15px;
    }
  }
  > .filters-wrapper {
    display: flex;
    flex-direction: row;
    gap: 40px;
    > div {
      display: flex;
      flex-direction: row;
      gap: 15px;
    }
  }
`;

const StyledDownload = styled(images.Download)`
  color: ${({ theme: { colors } }) => colors.blue};
`;

export enum ReservationTabs {
  ActiveReservations = 1,
  InactiveReservations = 2,
}

export const reservationTabs: TabItem[] = [
  { label: 'Todas', id: ReservationTabs.ActiveReservations },
  // { label: 'Pasadas', id: ReservationTabs.InactiveReservations },
];

type Props = {
  tabs?: TabItem[];
  activeTab: TabItem;
  onChangeTab?: (newActive: TabItem) => void;
  children?: React.ReactNode;
  hideFilters?: boolean;
  handleInputChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  inputValue?: string;
  placeholder?: string;
  disableInput?: boolean;
};

const ReservationTableLayout = ({
  tabs = reservationTabs,
  activeTab,
  onChangeTab,
  children,
  hideFilters,
  handleInputChange = () => {},
  inputValue = '',
  placeholder,
  disableInput,
}: Props) => (
  <StyledWrapper>
    <h6>Reservas</h6>
    <div>
      <StyledTab tabs={tabs} active={activeTab} onChange={onChangeTab} variant='outline' />
    </div>
    <StyledFilters>
      <Input
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder || 'Buscar por nombre o mail'}
        name='searchValue'
        leadingAdornment={<images.Search />}
        disabled={disableInput}
      />
      {!hideFilters && (
        <div className='filters-wrapper'>
          <FiltersButton />
          <div>
            <StyledDownload />
            <p>.xls</p>
            <p>.pdf</p>
          </div>
        </div>
      )}
    </StyledFilters>
    {children}
  </StyledWrapper>
);

export default ReservationTableLayout;
