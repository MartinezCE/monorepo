import styled from 'styled-components';
import Button from '../Button';
import LoadingSpinner from '../LoadingSpinner';
import Modal from '../Modal';
import Text from '../Text';

const StyledModal = styled(Modal)`
  > div > div {
    padding: 86px 134px;
    row-gap: 40px;
  }
`;

const StyledModalTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 8px;
  width: 280px;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StyledTitle = styled.h6`
  color: inherit;
`;

const StyledRow = styled.div`
  display: flex;
  column-gap: 24px;
  justify-content: center;
  align-items: center;
`;

type Props = {
  title: string;
  text?: string;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  disableButton?: boolean;
};

export default function DeleteBaseModal({
  title,
  text = 'Esta acción no se puede deshacer.',
  onClose,
  onCancel,
  onConfirm,
  disableButton,
}: Props) {
  return (
    <StyledModal onClose={onClose} variant='light'>
      <StyledModalTextWrapper>
        <StyledTitle>{title}</StyledTitle>
        <Text variant='large'>{text}</Text>
      </StyledModalTextWrapper>
      <StyledRow>
        <Button variant='outline' onClick={onCancel} disabled={disableButton}>
          Cancelar
        </Button>
        <Button
          trailingIcon={disableButton ? <LoadingSpinner /> : undefined}
          variant='primary'
          onClick={() => {
            onConfirm?.();
            onClose?.();
          }}
          disabled={disableButton}>
          Eliminar
        </Button>
      </StyledRow>
    </StyledModal>
  );
}
