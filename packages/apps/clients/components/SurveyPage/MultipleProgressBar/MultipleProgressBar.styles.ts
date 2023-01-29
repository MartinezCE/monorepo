import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
`;

export const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 30px;
`;

export const InfoText = styled.p`
  font-size: 1em;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.darkBlue};
  display: flex;
  align-items: center;
  column-gap: 8px;

  &::before {
    content: '';
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  &.bullet-blue::before {
    background-color: ${({ theme }) => theme.colors.blue};
  }

  &.bullet-green::before {
    background-color: ${({ theme }) => theme.colors.lightGreen};
  }
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray};
`;

export const MultipleProgressWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-radius: 40px;
  overflow: hidden;
  height: 50px;
`;

export const ProgressBar = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;

  &.blue-bar {
    background-color: ${({ theme }) => theme.colors.blue};
  }

  &.green-bar {
    background-color: ${({ theme }) => theme.colors.lightGreen};
  }
`;
