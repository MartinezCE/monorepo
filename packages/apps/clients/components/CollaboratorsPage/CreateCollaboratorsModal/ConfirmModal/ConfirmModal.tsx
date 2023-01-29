import React from 'react';
import { Modal, images, Button } from '@wimet/apps-shared';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  width: 665px;
  height: 550px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 69px 104px 69px 104px;
`;

const StyledIcon = styled(images.Checkmark)`
  transform: scale(1);
  color: ${({ theme }) => theme.colors.success};
`;

const StyledTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
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
  padding-left: 26px;
  padding-right: 26px;
  font-weight: 200;
  color: ${({ theme }) => theme.colors.white};
  font-size: 20px;
  line-height: 28px;
`;

const StyledActionsWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

type Props = {
  onClickClose: () => void;
};

const ConfirmModal = ({ onClickClose }: Props) => (
  <Modal onClose={onClickClose}>
    <StyledWrapper>
      <StyledIcon />
      <StyledTextWrapper>
        <StyledTitle>¡Listo!</StyledTitle>
        <StyledTitle>La invitación fue enviada exitosamente</StyledTitle>
        <StyledSubtitle>
          En breve, les llegará un email a tus invitados para poder acceder a la plataforma. Si aún no lo recibieron,
          pídeles que verifiquen su bandeja de spam.
        </StyledSubtitle>
      </StyledTextWrapper>
      <StyledActionsWrapper>
        <Button fullWidth={false} variant='six' onClick={onClickClose}>
          Continuar
        </Button>
      </StyledActionsWrapper>
    </StyledWrapper>
  </Modal>
);

export default ConfirmModal;
