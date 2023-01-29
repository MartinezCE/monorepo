import { Button, LoadingSpinner } from '@wimet/apps-shared';
import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const StyledSendButton = styled(Button)`
  margin-left: 24px;
`;

type Props = {
  cancelText?: string;
  actionText?: string;
  onClickCancel?: () => void;
  onClickSubmit?: () => void;
  isSubmitting?: boolean;
  isDisabled?: boolean;
};

const ModalActions = ({
  onClickSubmit,
  onClickCancel,
  isSubmitting,
  isDisabled,
  cancelText = 'Cancelar',
  actionText = 'Enviar',
}: Props) => (
  <StyledWrapper>
    <Button variant='outline' onClick={onClickCancel}>
      {cancelText}
    </Button>
    <StyledSendButton
      onClick={onClickSubmit}
      trailingIcon={isSubmitting ? <LoadingSpinner /> : undefined}
      disabled={isSubmitting || isDisabled}>
      {actionText}
    </StyledSendButton>
  </StyledWrapper>
);

export default ModalActions;
