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

const StyledButton = styled(Button)`
  margin-left: 24px;
`;

type Props = {
  onClickAccept: () => void;
  onClickClose: () => void;
};

const PendingLocationModal = ({ onClickAccept, onClickClose }: Props) => (
  <Modal onClose={onClickClose}>
    <StyledWrapper>
      <StyledIcon />
      <StyledTextWrapper>
        <StyledTitle>Ya cuentas con una locación en estado pendiente</StyledTitle>
        <StyledSubtitle>Deberás esperar tu aprobación para poder crear futuras locaciones</StyledSubtitle>
      </StyledTextWrapper>
      <StyledButton fullWidth={false} variant='six' onClick={onClickAccept}>
        Aceptar
      </StyledButton>
    </StyledWrapper>
  </Modal>
);

export default PendingLocationModal;
