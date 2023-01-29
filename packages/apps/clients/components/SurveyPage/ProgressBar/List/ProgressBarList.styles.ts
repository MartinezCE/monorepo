import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ProgressColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 6px;
`;

export const Divider = styled.div`
  width: 2px;
  background-color: ${({ theme }) => theme.colors.gray};
  margin: 0 32px;
`;

export const ProgressItem = styled.div`
  padding: 12px 0;

  &:not(:last-child) {
    border-bottom: dashed 2px ${({ theme }) => theme.colors.lightGray};
  }
`;
