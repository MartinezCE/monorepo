import React, { useMemo, useState } from 'react';
import {
  HourlySpaceReservation,
  Select,
  SpaceReservationsTable,
  Tab,
  TabItem,
  WPMReservation,
} from '@wimet/apps-shared';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import WPMReservationsTable from './WPMReservationsTable';
import type { CollaboratorsDetailSidebarInitialValues } from '../CollaboratorsDetailSidebar';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
`;

const StyledSpaceReservationsTable = styled(SpaceReservationsTable)`
  margin-top: 40px;

  & table {
    & thead {
      background-color: ${({ theme }) => theme.colors.extraLightGray};
    }
    & tbody {
      & tr {
        &:nth-child(even) {
          background-color: ${({ theme }) => theme.colors.extraLightGray};
        }
      }
    }
  }
`;

const StyledTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkGray};
  margin-bottom: 40px;
`;

const StyledTab = styled(Tab)`
  & button {
    min-width: 72px;
    margin-right: 48px;
  }
`;

const StyledHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledFilterSelectWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: end;
`;

const StyledFilterSelect = styled(Select)`
  .react-select__indicators,
  .react-select__placeholder,
  .react-select__single-value,
  .react-select__input {
    font-weight: 200;
  }

  .react-select__control {
    .react-select__indicators svg {
      transition: transform 0.1s linear;
      transform: scale(0.8);
    }
    &--menu-is-open {
      .react-select__indicators svg {
        transform: rotate(180deg) scale(0.8);
      }
    }
  }
`;

const StyledNoReservations = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 48px;
`;

enum Tabs {
  ActiveReservations = 1,
  InactiveReservations = 2,
}

const tabs: TabItem[] = [
  { label: 'Todas', id: Tabs.ActiveReservations },
  // { label: 'Pasadas', id: Tabs.InactiveReservations },
];

export enum ReservationSortByOptions {
  WPM = 'WPM',
  SPACES = 'SPACES',
}

const filterOptions: { label: string; value: ReservationSortByOptions }[] = [
  /*   {
    label: 'Todas',
    value: 'all',
  }, */
  { label: 'Workplace Manager', value: ReservationSortByOptions.WPM },
  { label: 'Planes', value: ReservationSortByOptions.SPACES },
];

type Props = {
  wpmReservations?: WPMReservation[];
  spacesReservations?: HourlySpaceReservation[];
};

const CollaboratorsReservations = ({ wpmReservations, spacesReservations }: Props) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const { values } = useFormikContext<CollaboratorsDetailSidebarInitialValues>();
  const config = {
    [ReservationSortByOptions.WPM]: wpmReservations,
    [ReservationSortByOptions.SPACES]: spacesReservations,
  };

  const selectedTable = useMemo(() => {
    if (values.reservationType === ReservationSortByOptions.WPM) {
      return <WPMReservationsTable reservations={wpmReservations} />;
    }

    return (
      <StyledSpaceReservationsTable
        reservations={spacesReservations}
        hiddenColumns={['user', 'spaceType', 'credits']}
      />
    );
  }, [spacesReservations, values.reservationType, wpmReservations]);

  return (
    <StyledWrapper>
      <StyledTitle>Reservas</StyledTitle>
      <StyledHeaderWrapper>
        <StyledTab tabs={tabs} active={selectedTab} onChange={newTab => setSelectedTab(newTab)} variant='outline' />
        <StyledFilterSelectWrapper onClick={e => e.stopPropagation()}>
          <StyledFilterSelect
            prefix='Ver:'
            variant='tertiary'
            options={filterOptions}
            instanceId='sortOptions'
            name='reservationType'
            alignMenu='center'
          />
        </StyledFilterSelectWrapper>
      </StyledHeaderWrapper>
      {config[values.reservationType]?.length ? (
        selectedTable
      ) : (
        <StyledNoReservations>No hay reservas hechas aún</StyledNoReservations>
      )}
    </StyledWrapper>
  );
};

export default CollaboratorsReservations;
