import React from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div<{ onClick?: () => void }>`
  padding: 6px 8px;
  color: ${props => props.theme.colors.blue};
  background: ${props => props.theme.colors.extraLightBlue};
  border-radius: 4px;
  height: 28px;
  font-weight: 700;
  font-size: 12px;
  display: flex;
  align-items: center;
  cursor: ${props => (props.onClick ? 'pointer' : 'default')};
`;

type Props = {
  onClick?: () => void;
  className?: string;
};

const Tag: React.FC<Props> = ({ children, onClick, className }) => (
  <StyledContainer role={onClick && 'button'} onClick={onClick} className={className}>
    {children}
  </StyledContainer>
);

export default Tag;
