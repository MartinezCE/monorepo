import styled from 'styled-components';

export const GeneralStatusCardWrapper = styled.div`
  border-radius: 8px;
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06);
  display: flex;
  flex-direction: column;
  row-gap: 30px;
  width: 100%;

  min-height: fit-content;

  .general-status {
    &__title {
      font-weight: 400;
      font-size: 1.1em;
    }

    &__info {
      display: flex;
      flex-direction: column;
      row-gap: 1.3em;

      &--number {
        font-size: 2.2em;
        font-weight: 600;
      }

      &__status {
        display: flex;
        column-gap: 8px;
        font-size: 0.9em;

        &--icon {
          font-size: 1.4em;
          -webkit-text-stroke: 0.06em;
        }

        &--percentage {
          font-weight: 400;
        }

        &--text {
          color: ${({ theme }) => theme.colors.gray};
          font-weight: 400;
        }

        .success {
          color: ${({ theme }) => theme.colors.success};
        }

        .error {
          color: ${({ theme }) => theme.colors.error};
        }

        &--icon.error {
          transform: rotate(180deg);
        }
      }
    }
  }
`;
