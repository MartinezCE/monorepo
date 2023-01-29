import { Modal, images, Text, Button } from '@wimet/apps-shared';
import styled from 'styled-components';
import { ModalTypes } from '../../UsersTable/UsersTable';

const StyledModal = styled(Modal)`
  > div {
    max-width: 800px;
  }
`;

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 68px 113px 64px 113px;
  display: flex;
  flex-direction: column;
`;

const StyledInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
`;

const StyledTitle = styled.span`
  width: 100%;
  text-align: left;
  font-size: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkGray};
  margin-bottom: 20px;
`;

const StyledDescription = styled(Text)`
  text-align: left;
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  display: flex;
  column-gap: 26px;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.colors.extraLightGray};
`;

const StyledColumn = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 4px;
`;

const StyledWorkplaceIcon = styled(images.IconBiggerWorkplace)`
  color: ${({ theme }) => theme.colors.blue};
  flex-shrink: 0;
`;

const StyledStarIcon = styled(images.Star)`
  color: ${({ theme }) => theme.colors.blue};
  flex-shrink: 0;
`;

const StyledText = styled(Text)`
  text-align: left;
`;

const StyledActionsWrapper = styled.div`
  width: 100%;
  margin-top: 34px;
  display: flex;
  justify-content: center;
`;

type Props = {
  onClick?: (type: ModalTypes) => void;
  onClose?: () => void;
};

const AccessOptionsModal = ({ onClick, onClose }: Props) => (
  <StyledModal variant='light' onClose={onClose}>
    <StyledWrapper>
      <StyledTitle>Accesos</StyledTitle>
      <StyledDescription variant='large'>
        Puedes configurar los planos y asientos que el usuario puede ver y reservar, e incluso filtrar estos útltimos
        por amenities que tengan en común.
        <br />
        <br />
        Elige cómo deseas configurar los planos del usuario:
      </StyledDescription>
      <StyledInnerWrapper>
        <StyledButton variant='secondary' onClick={() => onClick?.(ModalTypes.BLUEPRINTS)}>
          <StyledWorkplaceIcon />
          <StyledColumn>
            <StyledText>
              <b>Por plano</b>
            </StyledText>
            <StyledText>
              Otorga el acceso a uno o más planos y filtra los asientos que se pueden reservar según los amenities
              seleccionadas por plano.
            </StyledText>
          </StyledColumn>
        </StyledButton>
        <StyledButton variant='secondary' onClick={() => onClick?.(ModalTypes.AMENITIES)}>
          <StyledStarIcon />
          <StyledColumn>
            <StyledText>
              <b>Por amenities</b>
            </StyledText>
            <StyledText>
              Limita el acceso del usuario según los amenities que selecciones en los planos que cuentan con ellas.
            </StyledText>
          </StyledColumn>
        </StyledButton>
      </StyledInnerWrapper>
      <StyledActionsWrapper>
        <Button variant='outline' onClick={onClose}>
          Cancelar
        </Button>
      </StyledActionsWrapper>
    </StyledWrapper>
  </StyledModal>
);

export default AccessOptionsModal;
