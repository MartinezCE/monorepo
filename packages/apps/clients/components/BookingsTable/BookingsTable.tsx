/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { Cell, Column, useTable } from 'react-table';
import {
  Button,
  Label,
  Profile,
  Table,
  Chip,
  ChipThemes,
  images,
  WPMReservation,
  mixins,
  WPMReservationTypeLabels,
  WPMReservationTypes,
} from '@wimet/apps-shared';
import styled from 'styled-components';
import { formatInTimeZone } from 'date-fns-tz';

const ReservationStatusProps = {
  PENDING: {
    text: 'Pendiente',
    theme: 'disabled',
  },
  CANCEL: {
    text: 'Cancelado',
    theme: 'error',
  },
  DONE: {
    text: 'Confirmado',
    theme: 'success',
  },
} as { [key: string]: { text: string; theme: ChipThemes } };

const StyledColumn = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;

  .clamp-text {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const StyledProfile = styled(StyledColumn)`
  display: flex;
  align-items: center;

  .profile-user-data {
    display: flex;
    flex-direction: column;
  }
`;

const StyledEmailLabel = styled(Label)`
  font-weight: 200;
`;

const StyledButton = styled(Button)`
  ${mixins.ButtonIconMixin};
  ${mixins.ButtonIconGrayMixin};
`;

type ColumnIds =
  | 'user'
  | 'reservationType'
  | 'locationName'
  | 'floorNumber'
  | 'blueprintName'
  | 'seatName'
  | 'reservationDate'
  | 'actions'
  | 'reservationState';

type DataIds = 'userMail';

type Props = {
  reservations: WPMReservation[];
  hiddenColumns?: ColumnIds[];
  hiddenData?: DataIds[];
  emptyState?: React.ReactNode;
};

export default function BookingsTable({ reservations, hiddenColumns = [], hiddenData = [], emptyState }: Props) {
  const columns = useMemo(
    () => [
      {
        id: 'user',
        Header: 'Nombre',
        Cell: ({
          row: {
            original: { user },
          },
        }: Cell<WPMReservation>) => (
          <StyledProfile>
            <Profile
              showUserLabel={false}
              variant={user?.avatarUrl ? 'transparent' : 'gray'}
              borderWidth={1}
              image={user?.avatarUrl}
            />
            <div className='profile-user-data'>
              <Label text={`${user?.firstName} ${user?.lastName}`} variant='currentColor' size='large' lowercase />
              {!hiddenData.includes('userMail') && (
                <StyledEmailLabel text={user?.email} variant='secondary' size='large' lowercase />
              )}
            </div>
          </StyledProfile>
        ),
      },
      {
        id: 'floorNumber',
        Header: 'Piso',
        Cell: ({
          row: {
            original: { seat },
          },
        }: Cell<WPMReservation>) => (
          <StyledColumn>
            <p>Piso {seat?.blueprint?.floor?.number}</p>
          </StyledColumn>
        ),
      },
      {
        id: 'blueprintName',
        Header: 'Area/Plano',
        Cell: ({
          row: {
            original: { seat },
          },
        }: Cell<WPMReservation>) => (
          <StyledColumn>
            <p title={seat?.blueprint?.name} className='clamp-text'>
              {seat?.blueprint?.name}
            </p>
          </StyledColumn>
        ),
      },
      {
        id: 'seatName',
        Header: 'Asiento',
        Cell: ({
          row: {
            original: { seat },
          },
        }: Cell<WPMReservation>) => (
          <StyledColumn>
            <p>{seat?.name}</p>
          </StyledColumn>
        ),
      },
      {
        id: 'reservationDate',
        Header: 'Fecha de reserva',
        Cell: ({ row: { original } }: Cell<WPMReservation>) => (
          <StyledColumn>
            <p>{formatInTimeZone(original.startAt, original.destinationTz, 'dd-MM-yyyy')}</p>
          </StyledColumn>
        ),
      },
      {
        id: 'reservationType',
        Header: 'Tipo de reserva',
        Cell: ({
          row: {
            original: { WPMReservationType },
          },
        }: Cell<WPMReservation>) => (
          <StyledColumn>
            <p>{WPMReservationTypeLabels[WPMReservationType?.name as WPMReservationTypes]}</p>
          </StyledColumn>
        ),
      },
      {
        id: 'locationName',
        Header: 'Locación',
        Cell: ({
          row: {
            original: { seat },
          },
        }: Cell<WPMReservation>) => (
          <StyledColumn>
            <p>{seat?.blueprint?.floor?.location?.name}</p>
          </StyledColumn>
        ),
      },
      {
        id: 'reservationState',
        Header: 'Estado',
        Cell: ({ row: { original } }: Cell<WPMReservation>) => (
          <StyledColumn>
            <Chip chipTheme={ReservationStatusProps[original.status].theme}>
              {ReservationStatusProps[original.status].text}
            </Chip>
          </StyledColumn>
        ),
      },
      {
        id: 'actions',
        accessor: 'actions',
        Cell: () => (
          <StyledColumn>
            <StyledButton variant='secondary' leadingIcon={<images.TinyBin />} onClick={() => {}} />
          </StyledColumn>
        ),
      },
    ],
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const data = useMemo(() => [...reservations], [reservations]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns: columns as Column<WPMReservation>[],
    data,
    initialState: { hiddenColumns },
  });

  if (!reservations.length && emptyState) return <>{emptyState}</>;

  return (
    <>
      <Table
        rows={rows}
        tableProps={{ ...getTableProps() }}
        headerGroups={headerGroups}
        prepareRow={prepareRow}
        bodyProps={{ ...getTableBodyProps() }}
      />
    </>
  );
}
