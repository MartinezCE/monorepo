import React from 'react';
import { Modal, images, Link } from '@wimet/apps-shared';
import styled from 'styled-components';

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
  column-gap: 24px;
`;

const StyledWorkspacesLink = styled(Link)`
  color: ${({ theme }) => theme.colors.white};
  border-color: ${({ theme }) => theme.colors.white};
  & :hover,
  & :focus {
    color: ${({ theme }) => theme.colors.darkBlue};
    background-color: ${({ theme }) => theme.colors.extraLightBlue};
  }
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.darkBlue};
`;

type Props = {
  onClose?: () => void;
  hrefWorkspaces?: string;
  hrefDemo?: string;
};

const PendingApprovalModal = ({ onClose, hrefWorkspaces, hrefDemo }: Props) => (
  <Modal onClose={onClose}>
    <StyledWrapper>
      <StyledIcon />
      <StyledTextWrapper>
        <StyledText>¡Todo listo para iniciar!</StyledText>
        <StyledSubtitle>
          Para poder continuar con el inicio de sesión es necesario agendar un demo con nosotros, en el cual te
          orientaremos como utilizar la plataforma.
        </StyledSubtitle>
      </StyledTextWrapper>
      <StyledActions>
        <StyledWorkspacesLink fullWidth={false} variant='outline' href={hrefWorkspaces}>
          Explora Workspaces
        </StyledWorkspacesLink>
        <StyledLink fullWidth={false} variant='fourth' href={hrefDemo}>
          Agendar demo
        </StyledLink>
      </StyledActions>
    </StyledWrapper>
  </Modal>
);

export default PendingApprovalModal;
