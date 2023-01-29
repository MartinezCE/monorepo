import { images, Label, LocationFile } from '@wimet/apps-shared';
import styled from 'styled-components';

const StyledOverlay = styled.a`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, transparent -23.36%, ${({ theme }) => theme.colors.white} 77.34%);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  color: ${({ theme }) => theme.colors.darkBlue};
  padding: 20px;
  transition: opacity 0.2s ease-in-out;
  cursor: pointer;
  opacity: 0;
`;

const StyledWrapper = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  width: 179px;
  height: 150px;
  background: ${({ theme }) => theme.colors.white};
  padding: 24px 22px;

  &:hover ${StyledOverlay} {
    opacity: 1;
  }
`;

const StyledDocumentImage = styled(images.Document)`
  color: ${({ theme }) => theme.colors.darkBlue};
  flex-shrink: 0;
`;

const StyledLabel = styled(Label)`
  font-weight: ${({ theme }) => theme.fontWeight[0]};
  margin-top: 12px;
  text-align: center;
`;

type Props = {
  document: LocationFile;
};

export default function SpaceDetailsDocumentButton({ document }: Props) {
  const file = document.name;
  const name = file.replace(file.slice(file.lastIndexOf('.'), file.length), '');
  return (
    <StyledWrapper>
      <StyledDocumentImage />
      <StyledLabel size='large' text={name} variant='currentColor' lowercase />
      <StyledOverlay href={document.url}>
        <images.Download />
      </StyledOverlay>
    </StyledWrapper>
  );
}
