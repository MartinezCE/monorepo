import React from 'react';
import { Button, images, Modal } from '@wimet/apps-shared';
import styled from 'styled-components';

const StyledWrappedModal = styled(Modal)`
  height: 100vh;
  width: 100vw;
  background-color: rgb(44 48 56 / 80%) !important;
  > div {
    width: 520px;
    height: 351px;
    background-color: white;
    & > div > button {
      color: ${({ theme }) => theme.colors.darkGray};
    }
  }
`;

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 72px 64px 88px 64px;
`;

const StyledIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const StyledIcon = styled(images.TinyBin)`
  transform: scale(1.6);
  color: ${({ theme }) => theme.colors.error};
`;

const StyledQuestion = styled.div`
  margin-top: 24px;
  color: ${({ theme }) => theme.colors.error};
  font-size: 24px;
  font-weight: 500;
`;
const StyledComment = styled.div`
  margin-top: 14px;
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: 16px;
  font-weight: 200;
`;

const StyledActions = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
`;
const StyledButton = styled(Button)`
  margin-left: 24px;
`;

type Props = {
  children?: React.ReactNode;
  onClickClose?: () => void;
  onClickDelete?: () => void;
};

const DEFAULT_TEXT = 'Esta acción no se puede deshacer.';

const DeleteContactModal = ({ onClickClose, onClickDelete, children }: Props) => (
  <StyledWrappedModal onClose={onClickClose}>
    <StyledWrapper>
      <StyledIconWrapper>
        <StyledIcon />
      </StyledIconWrapper>
      <StyledQuestion>¿Seguro quieres eliminar tu cuenta?</StyledQuestion>
      <StyledComment>{children || DEFAULT_TEXT}</StyledComment>
      <StyledActions>
        <Button onClick={onClickClose} variant='outline'>
          Cancelar
        </Button>
        <StyledButton onClick={onClickDelete}>Eliminar</StyledButton>
      </StyledActions>
    </StyledWrapper>
  </StyledWrappedModal>
);

export default DeleteContactModal;
