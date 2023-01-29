/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label, Modal, images, Button } from '@wimet/apps-shared';
import { useFormikContext } from 'formik';
import { ReactNode } from 'react';
import styled from 'styled-components';

const StyledModal = styled(Modal)`
  > div > div {
    padding: 72px 118px;
    row-gap: 50px;
  }
`;

const StyledCheckmark = styled(images.Checkmark)`
  color: ${({ theme }) => theme.colors.success};
`;

const StyledModalTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 10px;
  width: 429px;
`;

const StyledModalText = styled.h6`
  color: inherit;
`;

type Props = {
  onClose?: () => void;
  onFinish?: () => void;
  children?: ReactNode;
  buttonText?: string;
};

export default function FeedbackRegisterModal({ onClose, onFinish, children, buttonText = 'Cargar locación' }: Props) {
  const { values } = useFormikContext<any>();
  return (
    <StyledModal onClose={onClose}>
      <StyledCheckmark />
      {!children ? (
        <StyledModalTextWrapper>
          <Label text='¡Bienvenidos!' variant='currentColor' size='xlarge' lowercase />
          <StyledModalText>
            {values.company.name}
            <br />
            ya está registrado en Wimet
          </StyledModalText>
        </StyledModalTextWrapper>
      ) : (
        children
      )}
      <Button variant='six' onClick={onFinish}>
        {buttonText}
      </Button>
    </StyledModal>
  );
}
