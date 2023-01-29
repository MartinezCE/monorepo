import React from 'react';
import { Modal, Button } from '@wimet/apps-shared';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  width: 665px;
  height: 495px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledTextWrapper = styled.div`
  max-width: 332px;
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  margin-bottom: 64px;
  align-items: center;
`;
const StyledTitle = styled.span`
  text-align: center;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
  font-size: 24px;
  line-height: 32px;
`;
const StyledButton = styled(Button)`
  color: ${({ theme }) => theme.colors.darkBlue};
`;

const StyledText = styled.div`
  margin-top: 24px;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 100;
  line-height: 28px;
  max-width: 405px;
`;

type Props = {
  title?: string | React.ReactNode;
  icon: React.ReactElement;
  text?: string;
  onAcceptText: string;
  onAccept: () => void;
  onClickClose: () => void;
};

const ReservationMessageModal = ({ onClickClose, title, text, onAccept, onAcceptText, icon }: Props) => (
  <Modal onClose={onClickClose}>
    <StyledWrapper>
      <div>{icon}</div>
      <StyledTextWrapper>
        <StyledTitle>{title}</StyledTitle>
        <StyledText>{text}</StyledText>
      </StyledTextWrapper>
      <StyledButton fullWidth={false} variant='fourth' onClick={onAccept}>
        {onAcceptText}
      </StyledButton>
    </StyledWrapper>
  </Modal>
);

export default ReservationMessageModal;
