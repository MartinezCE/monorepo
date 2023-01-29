import styled from 'styled-components';
import Label from '../Label';

const StyledText = styled.h6`
  display: flex;
  flex-direction: column;
  font-weight: 300;
  margin-right: 36px;
  flex-shrink: 0;
  font-size: 20px;
  line-height: ${({ theme }) => theme.fontSizes[5]};
  row-gap: 10px;
`;

const StyledInnerTextWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 10px;

  > strong {
    font-size: ${({ theme }) => theme.fontSizes[5]};
    line-height: ${({ theme }) => theme.fontSizes[6]};
  }
`;

type Props = {
  primaryText?: string;
  secondaryText?: string;
  className?: string;
  primaryIcon?: any;
  description?: string;
};

export default function BaseHeaderTitle({ primaryText, secondaryText, className, primaryIcon, description }: Props) {
  return (
    <StyledText className={className}>
      <StyledInnerTextWrapper>
        <strong>{primaryText}</strong> {secondaryText} {primaryIcon}
      </StyledInnerTextWrapper>
      {description && <Label text={description} lowercase variant='currentColor' size='xlarge' />}
    </StyledText>
  );
}
