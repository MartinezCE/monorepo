import styled from 'styled-components';

export const StyledMenuLink = styled.a`
  text-decoration: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes[2]};
  font-weight: 300;
  color: ${({ theme }) => theme.colors.darkGray};
`;

export const StyledDemoLink = styled(StyledMenuLink)`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.orange};
`;
