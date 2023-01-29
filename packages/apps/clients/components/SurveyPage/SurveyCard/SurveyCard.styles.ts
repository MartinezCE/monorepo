import styled from 'styled-components';

export const CardWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows[2]};
  border-radius: 8px;
  padding: 30px;
  display: flex;
  align-items: center;
  width: 680px;
  column-gap: 40px;
  align-items: flex-start;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  transition: box-shadow 0.22s ease-in-out;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows[0]};
  }
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 2px;
  width: 80%;

  & > :last-child {
    margin-top: 20px;
  }
`;

export const Title = styled.p`
  font-weight: 700;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.black};
  width: 100%;
`;

export const Description = styled.p<{ isLink?: boolean }>`
  font-weight: 300;
  font-size: 16px;
  color: ${({ theme, isLink }) => (isLink ? theme.colors.blue : theme.colors.darkGray)};
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
