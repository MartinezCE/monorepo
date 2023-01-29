import React, { ReactNode } from 'react';
import styled from 'styled-components';
import CommonText from '../Text';
import { images } from '../../assets';

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const IconWarning = styled(images.Warning)`
  width: 18px;
  height: 18px;
  color: ${({ theme }) => theme.colors.orange};
  flex-shrink: 0;
  margin-right: 12px;
`;

const Text = styled(CommonText)`
  color: ${({ theme }) => theme.colors.spanishGray};
`;

type Props = {
  children: ReactNode;
  className?: string;
};

const BlockInfo: React.FC<Props> = ({ children, className }) => (
  <StyledWrapper className={className}>
    <IconWarning />
    <Text>{children}</Text>
  </StyledWrapper>
);

export default BlockInfo;
