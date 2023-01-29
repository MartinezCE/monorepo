import styled from 'styled-components';
import LoadingSpinner from '../LoadingSpinner';
import Modal from '../Modal';

const StyledModal = styled(Modal)`
  > div {
    background-color: transparent;
  }
`;

const StyledLoadingSpinner = styled(LoadingSpinner)`
  width: 50px;
  height: 50px;
  border-width: 4px;
  border-color: ${({ theme }) => theme.colors.blue};
  border-top-color: ${({ theme }) => theme.colors.gray};
`;

export default function LoadingModal() {
  return (
    <StyledModal showCloseButton={false}>
      <StyledLoadingSpinner />
    </StyledModal>
  );
}
