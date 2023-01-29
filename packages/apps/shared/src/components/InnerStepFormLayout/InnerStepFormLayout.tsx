import { ReactNode } from 'react';
import styled from 'styled-components';
import Label from '../Label';
import Text from '../Text';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledLabel = styled(Label)`
  margin-bottom: 16px;
`;

const StyledText = styled(Text)`
  max-width: 500px;
`;

type Props = {
  label: string;
  description: string;
  children?: ReactNode;
  className?: string;
};

export default function InnerStepFormLayout({ label, description, children, className }: Props) {
  return (
    <StyledWrapper className={className}>
      <StyledLabel text={label} variant='tertiary' size='xlarge' lowercase />
      <StyledText>{description}</StyledText>
      {children}
    </StyledWrapper>
  );
}
