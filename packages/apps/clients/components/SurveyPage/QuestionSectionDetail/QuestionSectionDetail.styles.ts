import styled from 'styled-components';

export const QuestionSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 50px;
`;

export const QuestionContainer = styled.div`
  padding: 60px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows[2]};
`;

export const QuestionTitle = styled.p`
  font-weight: 700;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.darkBlue};
  padding-bottom: 50px;
`;
