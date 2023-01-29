import { Input } from '@wimet/apps-shared';
import styled from 'styled-components';

const StyledInput = styled(Input)<{ readOnly?: boolean }>`
  ${props => props.readOnly && 'pointer-events: none;'}
  input {
    height: 20px;
    margin-bottom: 0;
    font-weight: 400;
    color: ${props => props.theme.colors.darkGray};
  }
`;

type Props = {
  floorIndex?: number;
  blueprintIndex?: number;
  readOnly?: boolean;
  blueprintId?: string;
  floorId?: string;
};

const BlueprintName: React.FC<Props> = ({ floorIndex, blueprintIndex, readOnly }) => (
  <div
    style={{
      marginTop: 12,
    }}>
    <StyledInput
      readOnly={readOnly}
      placeholder='Nombre del plano'
      name={readOnly ? 'fallbackInput' : `floors[${floorIndex}].blueprints[${blueprintIndex}].name`}
      variant='transparent'
    />
  </div>
);

export default BlueprintName;
