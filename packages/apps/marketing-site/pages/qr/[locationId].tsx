import { useRouter } from 'next/router';
import React from 'react';
import QRCode from 'react-qr-code';
import styled from 'styled-components';
import wimet from '../../assets/images/wimet.png';

export const Header = styled.div`
  @media screen and (min-width: 768px) {
    width: auto;
  }
`;

export const Title = styled.p`
  color: #0a083b;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 0px;
  font-family: 'Apercu Pro', sans-serif;
  margin-top: 35px;
  margin-left: 10px;
`;

export const IconLogo = styled.img`
  width: 55px;
  height: 55px;
`;
export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 110px;
  align-content: center;
  align-items: center;
  flex-direction: column;
`;

export const Qr = styled.div`
  padding: 16px;
`;

export const PrintButton = styled.button`
  background: #175cff;
  border-radius: 4px;
  color: white;
  width: 200px;
  height: 40px;
  border: none;
  margin-top: 110px;
  text-align: center;
`;
const styles = {
  header: {
    background: '#FFFFFF',
    boxShadow: '0px 20px 46px -20px rgba(44, 48, 56, 0.15)',
    borderRadius: '0px 0px 8px 8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
  },
};

export default function GenerateQr() {
  const { query } = useRouter();
  const { locationId } = query;
  const value = `${process.env.NEXT_PUBLIC_INDEX_URL}/checkin/${locationId}`;

  return (
    <>
      <Header style={styles.header}>
        <IconLogo src={wimet.src} alt='Wimet' />
        <Title> Wimet</Title>
      </Header>
      <Wrapper>
        <Qr>
          <QRCode size={256} value={value} />
        </Qr>

        <PrintButton
          type='submit'
          onClick={() => {
            window.print();
          }}>
          Descargar QR
        </PrintButton>
      </Wrapper>
    </>
  );
}
