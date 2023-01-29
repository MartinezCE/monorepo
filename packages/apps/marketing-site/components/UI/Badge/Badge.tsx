import React from 'react';
import styled from 'styled-components';

type BadgeProps = {
  backgroundColor?: string;
};

type StyledWrapperProps = {
  background?: string;
};

const StyledWrapper = styled.div<StyledWrapperProps>`
  background: ${({ background, theme }) => background || theme.colors.blue};
  border-radius: 4px;
  width: max-content;
  height: max-content;
  padding: 2px 8px;
  font-size: ${({ theme }) => theme.fontSizes[0]};
  line-height: 16px;
  color: ${({ theme }) => theme.colors.white};
`;

const Badge: React.FC<BadgeProps> = ({ children, backgroundColor }) => (
  <StyledWrapper background={backgroundColor}>{children}</StyledWrapper>
);

export default Badge;
