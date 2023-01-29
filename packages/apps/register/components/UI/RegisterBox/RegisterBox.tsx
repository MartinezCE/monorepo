import React from 'react';
import styled from 'styled-components';
import { Text, images, Link } from '@wimet/apps-shared';

const StyledWrapper = styled.div`
  height: 134px;
  padding: 42px 38px;
  display: flex;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  &::after {
    width: 4px;
  }
`;

type StyledContainerProps = {
  borderColor: string;
};

const StyledContainer = styled.div<StyledContainerProps>`
  border-left: 4px solid ${({ borderColor }) => borderColor};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-left: 14px;
`;

const StyledLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes[2]};
  font-weight: ${({ theme }) => theme.fontWeight[3]};
  color: ${({ theme }) => theme.colors.blue};
  text-decoration: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  column-gap: 4px;
  justify-content: flex-start;
  text-align: start;
`;

const IconArrowRight = styled(images.ArrowRight)`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

type Props = {
  title: string;
  linkText: string;
  url: string;
  borderColor: string;
};

const RegisterBox: React.FC<Props> = ({ title, linkText, url, borderColor }) => (
  <StyledWrapper>
    <StyledContainer borderColor={borderColor}>
      <Text>{title}</Text>
      <StyledLink href={url} noBackground>
        {linkText} <IconArrowRight />
      </StyledLink>
    </StyledContainer>
  </StyledWrapper>
);

export default RegisterBox;
