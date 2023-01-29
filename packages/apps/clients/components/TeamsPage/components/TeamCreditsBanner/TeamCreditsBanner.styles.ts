import styled from 'styled-components';

export const TeamCreditsWrapper = styled.div`
  display: flex;
  column-gap: 1.5em;
  padding: 16px 24px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;

  .team-credits-banner {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0.5em 0;

      &--title {
        font-weight: 700;
        font-size: 1.1em;
        color: ${({ theme }) => theme.colors.extraDarkBlue};
      }

      &--description {
        font-weight: 400;
        font-size: 0.9em;
        color: ${({ theme }) => theme.colors.darkGray};
      }
    }

    &__button {
      margin-left: auto;
      align-self: center;
    }
  }
`;
