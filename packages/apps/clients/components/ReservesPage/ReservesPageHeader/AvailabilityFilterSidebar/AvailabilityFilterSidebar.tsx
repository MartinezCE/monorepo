import { BaseFilterSidebar, Label, images, Link, Tag, Button } from '@wimet/apps-shared';
import styled, { css } from 'styled-components';

const StyledRow = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  border-bottom: 0.1em solid ${({ theme: { colors } }) => colors.extraLightBlue};
  padding-bottom: 32px;
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  > a {
    ${StyledRow}
    cursor: pointer;
    > div {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      color: ${({ theme: { colors } }) => colors.darkGray};
    }
    > svg {
      width: 20px;
      height: 20px;
      color: ${({ theme: { colors } }) => colors.darkGray};
    }
  }
  > div:not(:last-child) {
    ${StyledRow}
    > div {
      display: flex;
      flex-direction: row;
      gap: 16px;
    }
  }
  > div:last-child {
    display: flex;
    flex-direction: column;
    margin-top: 750px;
    gap: 24px;
    > button:last-child {
      color: ${({ theme: { colors } }) => colors.blue};
      font-weight: bold;
    }
  }
`;

type Props = {
  onClose: () => void;
};

export default function AvailabilityFilterSidebar({ onClose }: Props) {
  return (
    <BaseFilterSidebar title='Filtros' onClickClose={onClose}>
      <StyledWrapper>
        <Link variant='transparent' href='/'>
          <div>
            <Label text='Piso' lowercase variant='tertiary' size='large' />
            <Label text='Elige entre los pisos de la locación' lowercase variant='currentColor' size='large' />
          </div>
          <images.ArrowRight />
        </Link>
        <div>
          <Label text='Asientos' lowercase variant='tertiary' size='large' />
          <div>
            <Tag onClick={() => {}}>Disponibles</Tag>
            <Tag onClick={() => {}}>Ocupados</Tag>
            <Tag onClick={() => {}}>Medio dia</Tag>
          </div>
        </div>
        <div>
          <Label text='Favoritos' lowercase variant='tertiary' size='large' />
          <div>
            <Tag onClick={() => {}}>Todos</Tag>
            <Tag onClick={() => {}}>Sólo favoritos</Tag>
          </div>
        </div>
        <div>
          <Button onClick={() => {}} variant='primary'>
            Mostrar resultados
          </Button>
          <Button onClick={() => {}} variant='transparent'>
            Limpiar filtros
          </Button>
        </div>
      </StyledWrapper>
    </BaseFilterSidebar>
  );
}
