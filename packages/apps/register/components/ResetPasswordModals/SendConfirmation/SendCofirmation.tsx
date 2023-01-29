import { Modal } from '@wimet/apps-shared';
import { Plane } from '@wimet/apps-shared/lib/assets/images';
import styled from 'styled-components';

const StyledWrapperModal = styled.div`
  width: 400px;
  height: 330px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadows[0]};
  background-color: ${({ theme }) => theme.colors.blue};
  padding: 20px 0;
  border-radius: 30px;
  row-gap: 40px;
  position: relative;
`;

const StyledTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 8px;
  position: absolute;
  top: 20%;
  max-width: 60%;
`;

const StyledTitle = styled.p`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
  font-size: 24px;
  margin: 0;
  letter-spacing: 0.02em;
`;

const StyledSubtitle = styled.p`
  font-weight: 400;
  color: ${({ theme }) => theme.colors.white};
  font-size: 13px;
  line-height: 18px;
`;

const ResetPasswordModalSendConfirmation = () => (
  <Modal variant='custom' showCloseButton={false}>
    <StyledWrapperModal>
      <StyledTextWrapper>
        <StyledTitle>¡Enviado!</StyledTitle>
        <StyledSubtitle>Revisá tu bandeja de entrada o spam y seguí las instrucciones</StyledSubtitle>
      </StyledTextWrapper>
      <Plane />
    </StyledWrapperModal>
  </Modal>
);

export default ResetPasswordModalSendConfirmation;
