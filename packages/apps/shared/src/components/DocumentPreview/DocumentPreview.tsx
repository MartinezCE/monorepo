import styled, { css } from 'styled-components';
import { images } from '../../assets';
import Label from '../Label';

const StyledWrapper = styled.div<{ withBorder?: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  background: ${({ theme }) => theme.colors.white};
  padding: 0 16px;
  border-radius: 8px;

  ${({ withBorder }) =>
    withBorder &&
    css`
      border: 1px solid ${({ theme }) => theme.colors.lightGray};
    `}
`;

const StyledDocumentImage = styled(images.Document)`
  color: ${({ theme }) => theme.colors.darkBlue};
`;

const StyledLabel = styled(Label)`
  font-weight: ${({ theme }) => theme.fontWeight[0]};
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.darkGray};
`;

type Props = {
  withBorder?: boolean;
  name?: string;
};

export default function DocumentPreview({ withBorder, name }: Props) {
  return (
    <StyledWrapper withBorder={withBorder}>
      <StyledDocumentImage />
      <StyledLabel text={name} lowercase />
    </StyledWrapper>
  );
}
