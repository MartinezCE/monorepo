import { Widget } from '@typeform/embed-react';
import styled from 'styled-components';
import { BlockTypeForm } from '../../../interfaces/api';
import BlockWrapper from '../../common/HeaderBadgeButton/BlockWrapper';

type StyledWidgetProps = {
  maxWidth?: number;
};

const StyledWidget = styled(Widget)<StyledWidgetProps>`
  max-width: ${({ maxWidth }) => maxWidth}px;
  width: 100%;
`;

type Props = BlockTypeForm;

export default function TypeForm({ typeformId = 'RJ98BbAr', overlineText, title, width, height }: Props) {
  return (
    <BlockWrapper overlineText={overlineText} title={title}>
      <StyledWidget maxWidth={width} height={height} id={typeformId} disableAutoFocus={true} />
    </BlockWrapper>
  );
}
