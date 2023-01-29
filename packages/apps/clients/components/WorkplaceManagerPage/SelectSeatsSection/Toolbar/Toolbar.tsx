import styled from 'styled-components';
import { images } from '@wimet/apps-shared';
import BarButton from '../BarButton';
import { MODES } from '../../../../hooks/useBlueprintToolbar';

const StyledBar = styled.div`
  display: flex;
  column-gap: 10px;
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.lighterGray};
  border-radius: 4px;
  width: fit-content;
`;

type Props = {
  mode: MODES | null;
  handleChange: (newMode: MODES) => void;
};

const Toolbar = ({ mode, handleChange }: Props) => (
  <StyledBar>
    <BarButton
      icon={<images.TinyMore />}
      tooltipLabel='Agregar'
      active={!!mode && [MODES.ADD, MODES.ADD_MIGRATED].includes(mode)}
      onClick={() => handleChange(MODES.ADD)}
    />
    <BarButton
      icon={<images.TinyEdit />}
      tooltipLabel='Editar'
      active={mode === MODES.EDIT}
      onClick={() => handleChange(MODES.EDIT)}
    />
    <BarButton
      icon={<images.TinyMove />}
      tooltipLabel='Mover'
      active={mode === MODES.MOVE}
      onClick={() => handleChange(MODES.MOVE)}
    />
    <BarButton
      icon={<images.TinyBin />}
      tooltipLabel='Borrar'
      active={mode === MODES.DELETE}
      onClick={() => handleChange(MODES.DELETE)}
    />

    {/*
    TODO: implement Undo button 
    <BarButton icon={<images.TinyUndo />} tooltipLabel='Deshacer' />
    */}
  </StyledBar>
);

export default Toolbar;
