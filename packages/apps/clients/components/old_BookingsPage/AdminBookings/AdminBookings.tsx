import { BaseHeaderTitle, Input, Tab, images, FiltersButton, Select } from '@wimet/apps-shared';
import { TabItem } from '@wimet/apps-shared/src/types/api';
import { AxiosRequestHeaders } from 'axios';
import { FormikProvider, useFormik } from 'formik';
import { GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import styled from 'styled-components';
import useGetSpaceReservations, {
  getSpaceReservations,
  GET_SPACE_RESERVATIONS,
} from '../../../hooks/api/useGetSpaceReservations';
import BookingCard from './BookingCard';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 40px;
`;

const StyledFiltersSection = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  > div {
    display: flex;
    flex-direction: row;
  }
`;

const StyledTab = styled(Tab)`
  width: auto;
`;

const StyledSearchInput = styled(Input)`
  width: 364px;
  > div > svg {
    width: 28px;
    margin-top: 10px;
    margin-left: 15px;
  }
`;

const StyledSortSelect = styled(Select)`
  margin-left: 40px;
  & .react-select__placeholder,
  .react-select__indicators {
    color: ${({ theme }) => theme.colors.darkGray};
    font-weight: 200 !important;
  }
`;

const FILTER_TABS: TabItem[] = [
  { label: 'Activas', id: 1 },
  { label: 'Pasadas', id: 2 },
];

const SORT_OPTIONS = [
  {
    label: 'Más recientes',
    value: 'recently',
  },
  {
    label: 'Más antiguos',
    value: 'older',
  },
  {
    label: 'Planes A - Z',
    value: 'az',
  },
  {
    label: 'Planes Z - A',
    value: 'za',
  },
];

type SortOptions = typeof SORT_OPTIONS[number];

export default function AdminBookings() {
  const [pastReservations, setPastReservations] = useState(false);
  const [, setOrder] = useState<SortOptions>({ label: 'default', value: 'default' });
  const { data: reservations = [] } = useGetSpaceReservations();

  const formik = useFormik({
    initialValues: {
      searchValue: '',
    },
    onSubmit: () => {},
  });

  return (
    <StyledWrapper>
      <FormikProvider value={formik}>
        <BaseHeaderTitle primaryText='Reservas' />
        <StyledFiltersSection>
          <div>
            <StyledTab
              tabs={FILTER_TABS}
              active={pastReservations ? FILTER_TABS[1] : FILTER_TABS[0]}
              onChange={() => setPastReservations(!pastReservations)}
              variant='outline'
            />
            <StyledSearchInput
              placeholder='Buscar por locación, plan o miembro'
              name='searchValue'
              leadingAdornment={<images.Search />}
            />
          </div>
          <div>
            <FiltersButton />
            <StyledSortSelect
              variant='tertiary'
              options={SORT_OPTIONS}
              placeholder='Ordenar por'
              instanceId='sortOptions'
              name='sortBy'
              onChange={val => setOrder(val as SortOptions)}
              controlShouldRenderValue={false}
              alignMenu='center'
            />
          </div>
        </StyledFiltersSection>
        {reservations.map(item => (
          <BookingCard data={item} key={item.id} />
        ))}
      </FormikProvider>
    </StyledWrapper>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(GET_SPACE_RESERVATIONS, () =>
    getSpaceReservations(context.req.headers as AxiosRequestHeaders)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
