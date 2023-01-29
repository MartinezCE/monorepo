import styled from 'styled-components';

export const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  row-gap: 12px;
  max-width: 480px;
  margin: auto;
  padding: 2em 2em;

  .empty-state {
    &__title {
      margin-top: 10px;
      font-size: 1.2em;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.darkGray};
    }

    &__subtitle {
      font-size: 1em;
      font-weight: 300;
      color: ${({ theme }) => theme.colors.gray};
      line-height: 1.3em;
    }
  }
`;
