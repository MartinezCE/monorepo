import { Button, LoadingSpinner } from '@wimet/apps-shared';
import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  width: 421px;
  border-radius: 8px;
  padding: 40px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0px 20px 62px rgba(44, 48, 56, 0.05);
  right: 104px;
  z-index: 2;
  position: sticky;
  top: 95px;
  height: max-content;
  max-height: calc(100vh - 120px);
  margin-top: -92px;
  overflow-y: auto;
`;

const StyledTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.orange};
`;

const StyledDescription = styled.div`
  margin-top: 4px;
  margin-bottom: 41px;
  font-size: 16px;
  line-height: 24px;
  font-weight: 200;
`;

const StyledButton = styled(Button)`
  width: 100%;
  justify-content: center;
`;

const StyledCancelReminderText = styled.div`
  margin-top: 24px;
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: 14px;
  text-align: center;
  font-weight: 200;
  margin-bottom: 16px;
`;

type Props = {
  children: React.ReactNode;
  onClickReserve?: () => void;
  disableButton?: boolean;
  isLoading?: boolean;
};

const SpaceDetailsReserveCard = ({ children, onClickReserve, disableButton, isLoading }: Props) => (
  <StyledWrapper>
    <StyledTitle>Reserva el espacio</StyledTitle>
    <StyledDescription>
      Puedes confirmar tu lugar e invitar a otros con tus créditos una vez hecha la reserva.
    </StyledDescription>
    {children}
    <StyledButton
      variant='primary'
      onClick={onClickReserve}
      disabled={disableButton || isLoading}
      trailingIcon={isLoading ? <LoadingSpinner /> : undefined}>
      Continuar
    </StyledButton>
    <StyledCancelReminderText>Puedes cancelar tu reserva dentro de las 24 hs.</StyledCancelReminderText>
  </StyledWrapper>
);

export default SpaceDetailsReserveCard;
