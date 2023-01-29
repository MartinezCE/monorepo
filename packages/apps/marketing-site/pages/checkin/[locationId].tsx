import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from 'react-query';
import styled from 'styled-components';
import wimet from '../../assets/images/wimet.png';
// import location from '../../assets/images/location.png';
import check from '../../assets/images/Check.png';
import useCreateCheckIn from '../../hooks/api/useCreateCheckIn';
import useGetCheckIn, { getCheckIn, GET_CHECKIN } from '../../hooks/api/useGetCheckIn';
import { ReservationCheckIn } from '../../interfaces/api';

export const CardConfirmation = styled.div`
  width: 315px;
  height: 157px;
  margin: auto;
  background-color: #dadada;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 87px;
  border-radius: 13px;
`;
export const ExitText = styled.p`
  text-decoration-line: underline;
`;

export const CheckIcon = styled.img`
  top: -25px;
  position: absolute;
  width: 50px;
  height: 50px;
`;
export const CircleDone = styled.div`
  background-color: #31cd2e;
  height: 0.875em;
  border-radius: 50%;
  width: 0.875em;
`;

export const CirclePennding = styled.div`
  background-color: #b5b5b5;
  height: 0.875em;
  border-radius: 50%;
  width: 0.875em;
`;

export const CardCheckIn = styled.div`
  padding: 1em 0;
  border-top: 0.7px solid #b5b5b5;
  margin-bottom: 1em;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const CardHeaderReservation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 1em;
  margin-right: 1em;
  border-right: 0.7px solid #b5b5b5;
`;

export const CardHeaderReservationTitle = styled.div`
  color: #08083a;
  font-size: 12px;
`;

export const CardHeaderReservationSubTitle = styled.div`
  font-weight: 700;
  font-size: 50px;
  color: #0a083a;
`;

export const CardFloor = styled.p`
  font-weight: 700;
  font-size: 15px;
  line-height: 34px;
  color: #08083a;
  margin: 1em 0;
  padding: 1em 0;
  border-top: 0.7px solid #b5b5b5;
  border-bottom: 0.7px solid #b5b5b5;
`;

export const ContainerButton = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
export const ButtonCancel = styled.p`
  text-align: center;
  text-decoration-line: underline;
  margin-top: 40px;
  background-color: transparent;
  outline: none;
`;
export const ButtonCheckIn = styled.button`
  width: 167px;
  height: 27px;
  border: none;
  background: #31cd2e;
  color: #fff;
  box-shadow: 0px 4px 4px rgb(0 0 0 / 10%);
  border-radius: 20px;
`;

export const IconLogo = styled.img`
  width: 55px;
  height: 55px;
`;
export const IconLocation = styled.img`
  width: 27px;
  height: 27px;
`;

export const ButtonExit = styled.button`
  all: unset;
`;

export const Container = styled.div`
  @media screen and (min-width: 768px) {
    margin: auto;
    width: 800px;
  }
`;
export const Header = styled.div`
  @media screen and (min-width: 768px) {
    width: auto;
  }
`;
const styles = {
  header: {
    background: '#FFFFFF',
    boxShadow: '0px 20px 46px -20px rgba(44, 48, 56, 0.15)',
    borderRadius: '0px 0px 8px 8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
  },

  headerTitle: {
    fontFamily: 'Apercu Pro',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '22px',
    lineHeight: '27px',
    color: '#175cff',
  },
  main: {
    margin: '1.5em auto',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  titleCompany: {
    margin: '0',
    fontFamily: 'Apercu Pro',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '32px',
    lineHeight: '40px',
    color: '#0A083A',
    marginLeft: '0.5em',
  },
  subTitleCompany: {
    fontFamily: 'Apercu Pro',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '17px',
    lineHeight: '21px',
    color: '#0A083A',
  },
  search: {
    border: '1px solid #175CFF',
    borderRadius: '3px',
    padding: '1em',
    width: '100%',
    marginBottom: '1em',
    textAlign: 'center',
  } as React.CSSProperties,
  reservations: {
    width: '100%',
    textAlign: 'left',
    borderCollapse: 'collapse',
    marginTop: '1em',
  } as React.CSSProperties,
  reservationsHead: {
    fontWeight: '700',
    fontSize: '13px',
    lineHeight: '16px',
    color: '#08083A',
    borderBottom: '0.7px solid #000000',
  },
  reservationsBody: {
    fontFamily: 'Apercu Pro',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '15px',
    color: '#08083A',
    lineHeight: '3em',
  },
  reservationItem: {
    borderBottom: '0.7px solid #B5B5B5',
  },
  reservationDone: {
    fontweight: '700',
    fontsize: '15px',
    lineheight: '38px',
    color: '#31CD2E',
  },
  reservationPendding: {
    fontweight: '700',
    fontsize: '15px',
    lineheight: '38px',
    color: '#B5B5B5    ',
  },
  iconCheck: {
    top: '-25px',
    position: 'absolute',
    width: '50px',
    height: '50px',
  } as React.CSSProperties,
};

enum StatusCheckIn {
  LIST = 'list',
  CHECKIN = 'checkIn',
  CONFIRMATION = 'confirmation',
}

export default function Checkin() {
  const today = new Date();
  const { query } = useRouter();
  const { locationId } = query;
  const { data } = useGetCheckIn(locationId as string);
  const { mutateAsync: createCheckIn } = useCreateCheckIn(locationId as string);
  const [searchValue, setSearchValue] = useState('');
  const [activeCheckIn, setActiveCheckIn] = useState<ReservationCheckIn | null>(null);
  const [statusActive, setStatusActive] = useState(StatusCheckIn.LIST);
  const [dataFilter, setDataFilter] = useState<ReservationCheckIn[]>(data as ReservationCheckIn[]);

  useEffect(() => {
    setDataFilter(data as ReservationCheckIn[]);
  }, [data]);

  const handlerFilter = (value: string) => {
    const res = data?.filter((reservation: ReservationCheckIn) => {
      const name = reservation.user.firstName.toLowerCase();
      const lastName = reservation.user.lastName.toLocaleLowerCase();
      if ((value.length > 1 && name.includes(value.toLowerCase())) || lastName.includes(value.toLowerCase())) {
        return reservation;
      }
      return false;
    });
    setDataFilter(res as ReservationCheckIn[]);
  };

  return (
    <>
      <Header style={styles.header}>
        <IconLogo src={wimet.src} alt='Wimet' />
        <h1 style={styles.headerTitle}>Check-in</h1>
      </Header>
      <Container>
        <main style={styles.main}>
          {statusActive !== StatusCheckIn.CONFIRMATION && (
            <div>
              {/*    <div style={styles.titleContainer}>
              <IconLocation src={location.src} alt='Company' />
              <h2 style={styles.titleCompany}>Contract</h2>
            </div> */}
              <p style={styles.subTitleCompany}>
                Reservas del <strong>{`${today.getDate()}/${today.getMonth() + 1}`}</strong>
              </p>
            </div>
          )}{' '}
          {statusActive === StatusCheckIn.LIST && (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <input
                type='text'
                placeholder='Filtrar por nombre'
                style={styles.search}
                value={searchValue}
                onChange={e => {
                  setSearchValue(e.currentTarget.value);
                  handlerFilter(e.currentTarget.value);
                }}
              />
              <table style={styles.reservations}>
                <thead style={styles.reservationsHead}>
                  <tr>
                    <th>Puesto</th>
                    <th>Nombre y Apellido</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody style={styles.reservationsBody}>
                  {dataFilter?.map((reservation: ReservationCheckIn) => (
                    <tr
                      style={styles.reservationItem}
                      key={reservation.id}
                      role='button'
                      onClick={() => {
                        if (reservation.status !== 'DONE') {
                          setStatusActive(StatusCheckIn.CHECKIN);
                          setActiveCheckIn(reservation);
                        }
                      }}>
                      <td style={reservation.status === 'DONE' ? styles.reservationDone : styles.reservationPendding}>
                        {reservation.seat.name}
                      </td>
                      <td>{`${reservation.user.firstName} ${reservation.user.lastName}`}</td>
                      <td>{reservation.status === 'DONE' ? <CircleDone /> : <CirclePennding />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {statusActive === StatusCheckIn.CHECKIN && (
            <>
              {' '}
              <CardCheckIn>
                <CardHeader>
                  <CardHeaderReservation>
                    <CardHeaderReservationTitle>Puesto</CardHeaderReservationTitle>
                    <CardHeaderReservationSubTitle>{activeCheckIn?.seat.name}</CardHeaderReservationSubTitle>
                  </CardHeaderReservation>
                  <h2>{`${activeCheckIn?.user.firstName} ${activeCheckIn?.user.lastName}`} </h2>
                </CardHeader>
                <CardFloor>{`Plano: ${activeCheckIn?.seat.blueprint.name}`}</CardFloor>
              </CardCheckIn>
              <ContainerButton>
                <ButtonCheckIn
                  onClick={async () => {
                    await createCheckIn(activeCheckIn?.id as string);
                    setStatusActive(StatusCheckIn.CONFIRMATION);
                  }}>
                  Check-In
                </ButtonCheckIn>
                <ButtonCancel
                  onClick={() => {
                    setStatusActive(StatusCheckIn.LIST);
                    setActiveCheckIn(null);
                  }}>
                  Volver
                </ButtonCancel>
              </ContainerButton>
            </>
          )}
          {statusActive === StatusCheckIn.CONFIRMATION && (
            <CardConfirmation>
              <CheckIcon src={check.src} alt='checkIcon' />
              <p style={{ fontWeight: '700', fontSize: '24' }}>Reserva confirmada!</p>
              <ButtonExit
                type='button'
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                  window.location.reload();
                }}>
                <ExitText> Salir</ExitText>
              </ButtonExit>
            </CardConfirmation>
          )}
        </main>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const queryClient = new QueryClient();
  const locationId = context.params?.locationId || '';

  await Promise.all([queryClient.prefetchQuery([GET_CHECKIN, locationId], () => getCheckIn(locationId as string))]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
