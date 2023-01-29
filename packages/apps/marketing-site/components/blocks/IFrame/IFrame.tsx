import styled from 'styled-components';
import { BlockIFrame } from '../../../interfaces/api';
import BlockWrapper from '../../common/HeaderBadgeButton/BlockWrapper';

type StyledIframeProps = {
  maxWidth?: number;
};

const StyledIframe = styled.iframe<StyledIframeProps>`
  max-width: ${({ maxWidth }) => maxWidth}px;
  width: 100%;
`;

type Props = BlockIFrame;

export default function IFrame({ overlineText, title, url, width, height }: Props) {
  return (
    <BlockWrapper overlineText={overlineText} title={title}>
      <StyledIframe maxWidth={width} height={height} src={url} frameBorder='0' />
    </BlockWrapper>
  );
}
