import React from 'react';
import { Modal, images, Button } from '@wimet/apps-shared';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const StyledWrapper = styled.div`
  width: 665px;
  height: 495px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledIcon = styled(images.Checkmark)`
  transform: scale(0.9);
  color: ${({ theme }) => theme.colors.success};
`;

const StyledTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  margin-bottom: 64px;
`;
const StyledText = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
  font-size: 24px;
  line-height: 32px;
`;
const StyledSubtitle = styled.span`
  margin-top: 24px;
  width: 512px;
  font-weight: 100;
  color: ${({ theme }) => theme.colors.white};
  font-size: 20px;
  line-height: 28px;
`;
const StyledActions = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledPlansButton = styled(Button)`
  color: ${({ theme }) => theme.colors.white};
  border-color: ${({ theme }) => theme.colors.white};
  & :hover,
  & :focus {
    color: ${({ theme }) => theme.colors.darkBlue};
    background-color: ${({ theme }) => theme.colors.extraLightBlue};
  }
`;

const StyledButton = styled(Button)`
  margin-left: 24px;
  color: ${({ theme }) => theme.colors.darkBlue};
`;

const NewPlanConfirmationModal = () => {
  const router = useRouter();
  const handleOnClose = () => router.push('/pass/plans');

  return (
    <Modal onClose={handleOnClose}>
      <StyledWrapper>
        <StyledIcon />
        <StyledTextWrapper>
          <StyledText>¡Listo!</StyledText>
          <StyledText>Ya sos parte del Plan Enterprise</StyledText>
          <StyledSubtitle>
            A fin de mes, te llegará la factura a tu mail para que puedas abonar el total de los créditos consumidos.
          </StyledSubtitle>
        </StyledTextWrapper>
        <StyledActions>
          <StyledPlansButton fullWidth={false} variant='outline' onClick={handleOnClose}>
            Ver mis planes
          </StyledPlansButton>
          <StyledButton fullWidth={false} variant='fourth' onClick={handleOnClose}>
            Explora Workspaces
          </StyledButton>
        </StyledActions>
      </StyledWrapper>
    </Modal>
  );
};

export default NewPlanConfirmationModal;
