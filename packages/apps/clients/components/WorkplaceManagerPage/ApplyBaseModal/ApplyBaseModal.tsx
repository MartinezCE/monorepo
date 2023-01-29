import { Button, LoadingSpinner, Modal, pluralize, images } from '@wimet/apps-shared';
import React from 'react';
import styled from 'styled-components';

const StyledWrappedModal = styled(Modal)`
  height: 100vh;
  width: 100vw;

  > div {
    width: 1080px;
    height: 818px;
    background-color: ${({ theme }) => theme.colors.extraLightGray};
    & > div > button {
      color: ${({ theme }) => theme.colors.darkGray};
    }
  }
`;
const StyledContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 68px 113px 64px 113px;
  display: flex;
  flex-direction: column;
`;

const StyledTitle = styled.div`
  width: 100%;
  text-align: left;
  font-size: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkGray};
  margin-bottom: 40px;
`;

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 0 0 10px;
`;

const StyledSelectedText = styled.div`
  font-size: 14px;
  font-weight: 200;
  margin-left: 24px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StyledActionsWrapper = styled.div`
  width: 100%;
  margin-top: 34px;
  display: flex;
  column-gap: 14px;
  justify-content: space-between;
`;

const StyledInnerWrapper = styled.div`
  display: flex;
  column-gap: 14px;
`;

const StyledButton = styled(Button)`
  color: ${({ theme }) => theme.colors.blue};
`;

type Props = {
  onClickClose: () => void;
  onClickBack: () => void;
  onClickSave: () => void;
  isLoading: boolean;
  children?: React.ReactNode;
  selectedCount: number;
};

const ApplyBaseModal = ({ onClickClose, onClickBack, onClickSave, isLoading, children, selectedCount }: Props) => (
  <StyledWrappedModal onClose={onClickClose} variant='light'>
    <StyledContentWrapper>
      <StyledTitle>Accesos</StyledTitle>
      <StyledRow>
        <StyledSelectedText>{pluralize(selectedCount, 'seleccionado', true)}</StyledSelectedText>
      </StyledRow>
      {children}
      <StyledActionsWrapper>
        <StyledButton leadingIcon={<images.ChevronLeft />} variant='transparent' onClick={onClickBack}>
          Volver
        </StyledButton>
        <StyledInnerWrapper>
          <Button variant='outline' onClick={onClickClose}>
            Cancelar
          </Button>
          <Button disabled={isLoading} trailingIcon={isLoading ? <LoadingSpinner /> : undefined} onClick={onClickSave}>
            Guardar cambios
          </Button>
        </StyledInnerWrapper>
      </StyledActionsWrapper>
    </StyledContentWrapper>
  </StyledWrappedModal>
);

export default ApplyBaseModal;
