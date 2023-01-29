import React from 'react';
import { Modal, images, Button } from '@wimet/apps-shared';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  width: 610px;
  height: 474px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 62px 97.5px 62px 97.5px;
`;

const StyledIcon = styled(images.Checkmark)`
  transform: scale(0.9);
  color: ${({ theme }) => theme.colors.success};
`;

const StyledTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  margin-bottom: 64px;
`;

const StyledTitle = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
  font-size: 24px;
  line-height: 32px;
`;

const StyledSubtitle = styled.span`
  margin-top: 24px;
  font-weight: 200;
  color: ${({ theme }) => theme.colors.white};
  font-size: 20px;
  line-height: 28px;
`;
const StyledActionsWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledLocationButton = styled(Button)`
  color: ${({ theme }) => theme.colors.white};
  border-color: ${({ theme }) => theme.colors.white};
  &:hover {
    color: ${({ theme }) => theme.colors.darkBlue};
    background-color: ${({ theme }) => theme.colors.lightBlue};
    border-color: ${({ theme }) => theme.colors.lightBlue};
  }
`;

const StyledSendToApprovalButton = styled(Button)`
  margin-left: 24px;
`;

type Props = {
  onLocationsClick: () => void;
  onSendToApprovalClick: () => void;
  onClickClose: () => void;
};

const LocationCompletedModal = ({ onClickClose, onLocationsClick, onSendToApprovalClick }: Props) => (
  <Modal onClose={onClickClose}>
    <StyledWrapper>
      <StyledIcon />
      <StyledTextWrapper>
        <StyledTitle>¡Perfecto!</StyledTitle>
        <StyledTitle>Tu locación ya fue cargada</StyledTitle>
        <StyledSubtitle>Recuerda que deberás enviarla a aprobación para poder publicarla</StyledSubtitle>
      </StyledTextWrapper>
      <StyledActionsWrapper>
        <StyledLocationButton fullWidth={false} variant='outline' onClick={onLocationsClick}>
          Ir a Locaciones
        </StyledLocationButton>
        <StyledSendToApprovalButton fullWidth={false} variant='six' onClick={onSendToApprovalClick}>
          Enviar para aprobación
        </StyledSendToApprovalButton>
      </StyledActionsWrapper>
    </StyledWrapper>
  </Modal>
);

export default LocationCompletedModal;
