import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import useAllowedPath from '../../../hooks/useAllowedPath';
import OfferCard from './OfferCard';

const StyledWrapper = styled.div``;

const StyledCardstitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkGray};
`;
const StyledGridWrapper = styled.div`
  margin-top: 32px;
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  gap: 38px;
`;

type Props = {
  className?: string;
};

const OffersCards = ({ className }: Props) => {
  const router = useRouter();
  const allowedPath = useAllowedPath();

  return (
    <StyledWrapper className={className}>
      <StyledCardstitle>¿Qué ofrece Wimet?</StyledCardstitle>
      <StyledGridWrapper>
        <OfferCard
          title='Espacios por hora/día'
          subtitle='Establece tus reglas y paga solo por el uso.'
          actionText='Ver planes'
          onClick={() => router.push('/pass/plans')}
        />
        <OfferCard
          title='Espacios por mes'
          subtitle='Elige tu próximo HQ/Oficinas satélites bajo condiciones flexibles.'
          actionText='Ver espacios'
          onClick={() => router.replace(`${process.env.NEXT_PUBLIC_INDEX_URL}/discover`)}
        />
        {allowedPath('/workplace-manager') && (
          <OfferCard
            title='Workplace Manager'
            subtitle='Administra tu propio espacio y ten control eficiente sobre la disponibilidad.'
            actionText='Activar'
            onClick={() => router.push('/workplace-manager')}
          />
        )}
      </StyledGridWrapper>
    </StyledWrapper>
  );
};

export default OffersCards;
