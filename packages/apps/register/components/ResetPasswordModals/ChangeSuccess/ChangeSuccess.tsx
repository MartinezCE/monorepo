import { Modal } from '@wimet/apps-shared';
import { CheckSolid } from '@wimet/apps-shared/lib/assets/images';
import styled from 'styled-components';

const StyledWrapperModal = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadows[0]};
  background-color: ${({ theme }) => theme.colors.blue};
  padding: 50px 75px;
  border-radius: 30px;
  row-gap: 25px;
`;

const StyledTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 8px;
`;

const StyledTitle = styled.p`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
  font-size: 24px;
  margin: 0;
  letter-spacing: 0.02em;
  line-height: 30px;
`;

const ChageSuccess = ({ children }: { children?: React.ReactNode }) => (
  <Modal variant='custom' showCloseButton={false}>
    <StyledWrapperModal>
      <CheckSolid />
      <StyledTextWrapper>
        <StyledTitle>¡Tu contraseña fue recuperada con éxito!</StyledTitle>
        {children}
      </StyledTextWrapper>
    </StyledWrapperModal>
  </Modal>
);

export default ChageSuccess;
