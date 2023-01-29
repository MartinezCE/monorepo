import styled from 'styled-components';

export const SquarePillWrapper = styled.div`
  font-weight: 700;
  font-size: 1.8em;
  color: ${({ theme }) => theme.colors.blue};
  background-color: ${({ theme }) => theme.colors.extraLightBlue};
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 72px;
  height: 72px;
  border-radius: 16px;
  padding: 0.5em;
`;
