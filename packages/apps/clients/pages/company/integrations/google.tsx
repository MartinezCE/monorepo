import { BaseHeaderTitle, Button, Checkbox, images, LoadingSpinner, SeatGoogle } from '@wimet/apps-shared';
import { FormikProvider, useFormik } from 'formik';
import router from 'next/router';
import { ChangeEvent, useState } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import styled from 'styled-components';
import Layout from '../../../components/Layout';
import { useGetSyncGoogle, useCreateSeat } from '../../../hooks/api/useSynGoogle';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 72px;
`;

const StyledDescription = styled.p`
  display: flex;
  font-size: 14px;
  font-weight: 400;
  margin: 48px 0px;
`;

const StyleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
  align-items: center;
  > p {
    font-weight: 700;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.darkGray};
    margin-bottom: 1em;
  }
`;

const StyledCard = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 0.5em;
  box-shadow: 0px 20px 50px rgba(44, 48, 56, 0.12);
  border-radius: 8px;
`;

const TableSeatsGoogle = styled.table`
  width: 100%;
  text-align: left;
  background: #f8f8f8;
  > thead {
    border-bottom: 1px solid black;
    > tr > th {
      padding: 1em 0 1em 1em;
    }
  }
  > tbody > tr > td {
    padding: 1em 0 1em 1em;
  }
`;

const StyledCheckbox = styled(Checkbox)`
  border: 2px solid ${({ theme }) => theme.colors.blue};
  color: ${({ theme }) => theme.colors.blue};
`;

export default function Integrations() {
  const [loading, setLoading] = useState(false);
  const [seatsSelected, setSeatSelected] = useState<string[]>([]);
  const [allSeatsChecked, setAllSeatsChecked] = useState<boolean>(false);
  const { data: seats = [] } = useGetSyncGoogle();
  const { mutateAsync: createSeat } = useCreateSeat();

  const handlerChangeCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
    const id = event.target.value;
    const updatedSeatsSelected = !seatsSelected.includes(id)
      ? [...seatsSelected, id]
      : [...seatsSelected.filter(i => i !== id)];
    setSeatSelected(updatedSeatsSelected);
  };

  const handleCheckAllSeats = () => {
    setAllSeatsChecked(!allSeatsChecked);

    if (allSeatsChecked) {
      setSeatSelected([]);
    } else {
      setSeatSelected(seats.map(s => s.resourceId));
    }
  };

  const handlerSave = async () => {
    try {
      setLoading(true);
      await createSeat({ resourceIds: seatsSelected });
      router.replace('/workplace-manager/locations');
      // eslint-disable-next-line no-empty
    } catch (err) {}
  };

  const formik = useFormik({
    initialValues: { searchValue: '' },
    onSubmit: () => {},
  });

  return (
    <Layout>
      <FormikProvider value={formik}>
        <StyledWrapper>
          <BaseHeaderTitle primaryText='Sincroniza tus salas' />
          <StyledDescription>
            Selecciona tus salas de reuniones y edificios para sincronizarlos en wimet automaticamente.
          </StyledDescription>

          <StyleHeader>
            <p>Sin asignar</p>
            <Button
              variant='primary'
              trailingIcon={<images.TinyMore />}
              onClick={handlerSave}
              disabled={loading || !seatsSelected.length}>
              {loading && <LoadingSpinner />}
              Continuar
            </Button>
          </StyleHeader>
          <StyledCard>
            <TableSeatsGoogle>
              <thead>
                <tr>
                  <th>
                    <StyledCheckbox
                      onChange={handleCheckAllSeats}
                      checked={allSeatsChecked || seatsSelected.length === seats.length}
                    />
                  </th>
                  <th>Nombre sala</th>
                  <th>Locación</th>
                </tr>
              </thead>
              <tbody>
                {seats?.map((seat: SeatGoogle) => (
                  <tr key={seat.resourceId}>
                    <td>
                      <StyledCheckbox
                        value={seat.resourceId}
                        onChange={handlerChangeCheckbox}
                        checked={seatsSelected.includes(seat.resourceId)}
                      />
                    </td>
                    <td>{seat.resourceName}</td>
                    <td>{seat.generatedResourceName}</td>
                  </tr>
                ))}
              </tbody>
            </TableSeatsGoogle>
          </StyledCard>
        </StyledWrapper>
      </FormikProvider>
    </Layout>
  );
}

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
