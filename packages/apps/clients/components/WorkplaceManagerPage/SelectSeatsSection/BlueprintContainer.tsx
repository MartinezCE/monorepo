import styled from 'styled-components';

const StyledOverlayWrapper = styled.div`
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray};
  font-weight: ${({ theme }) => theme.fontWeight[0]};
  font-size: 20px;
  line-height: 28px;
  text-align: center;
`;

type Props = {
  showOverlay?: boolean;
};

const BlueprintContainer: React.FC<Props> = ({ showOverlay, children }) => (
  <>
    {showOverlay ? (
      <StyledOverlayWrapper>
        Seleccione un piso y plano para
        <br /> indicar su disponibilidad
      </StyledOverlayWrapper>
    ) : (
      children
    )}
  </>
);

export default BlueprintContainer;
