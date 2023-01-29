import styled, { css } from 'styled-components';

export const ModalWrapper = styled.div`
  width: 580px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 22px;
  padding: 40px 50px;

  .modal-credits {
    &__header {
      display: flex;
      width: 100%;
      column-gap: 22px;
      align-items: center;

      &__title {
        font-size: 1.8em;
        color: ${({ theme }) => theme.colors.extraDarkBlue};
        font-weight: 700;
      }
    }

    &__subtitle {
      font-size: 1em;
      font-weight: 600;
      align-self: flex-start;
      margin-bottom: 12px;
    }

    &__input {
      width: 100%;
      text-align: start;
    }

    &__actions {
      display: flex;
      column-gap: 20px;
      margin: auto;
      margin-top: 20px;
    }
  }

  .payments-resume-table {
    width: 100%;
    overflow: hidden;
    opacity: 0.2;
    max-height: 0;
    -webkit-transition: all 1.1s cubic-bezier(0, 1, 0, 1);
    -moz-transition: all 1.1s cubic-bezier(0, 1, 0, 1);
    -ms-transition: all 1.1s cubic-bezier(0, 1, 0, 1);
    -o-transition: all 1.1s cubic-bezier(0, 1, 0, 1);
    transition: all 1.1s cubic-bezier(0, 1, 0, 1);

    &.show {
      opacity: 1;
      max-height: 1000px;
      transition: max-height 1s ease-in-out;
    }
  }

  .payment-method {
    width: 100%;
    text-align: start;
    margin-top: 8px;
  }
`;

export const TogglePayment = styled.div`
  display: flex;
  width: 100%;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

export const ToggleItem = styled.div<{ $selected: boolean }>`
  flex-grow: 1;
  padding: 12px 0;
  background-color: ${({ theme }) => theme.colors.lighterGray};
  width: 50%;
  text-transform: uppercase;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray};
  font-weight: 300;

  &:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    border-right: solid 3px white;
  }

  &:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  &:hover {
    cursor: pointer;
  }

  ${({ $selected }) =>
    $selected &&
    css`
      background-color: ${({ theme }) => theme.colors.lightBlue};
      color: ${({ theme }) => theme.colors.extraDarkBlue};

      &:hover {
        cursor: default;
      }
    `}
`;

export const BuyCreditsResumeTable = styled.table`
  font-size: 1em;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.darkGray};
  width: 100%;
  text-align: left;
  position: relative;
  border-collapse: collapse;

  td {
    width: 33%;
  }

  td:nth-child(2) {
    text-align: center;
  }

  td:last-child {
    text-align: end;
  }

  thead {
    td {
      padding: 12px 16px;
      font-weight: 500;
      background-color: ${({ theme }) => theme.colors.extraLightGray};

      &:first-child {
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
      }

      &:last-child {
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
      }
    }
  }

  tbody {
    td {
      padding: 22px 16px;
    }

    td:last-child {
      color: ${({ theme }) => theme.colors.darkBlue};
    }

    tr:not(:last-child) {
      border-bottom: solid 1px ${({ theme }) => theme.colors.lightGray};
    }
  }
`;

export const BuyCreditsResumeTableFooter = styled.div`
  padding: 18px 16px;
  background-color: ${({ theme }) => theme.colors.extraLightGray};
  display: flex;
  width: 100%;
  justify-content: space-between;
  border-radius: 6px;

  p {
    font-size: 1.2em;
    color: ${({ theme }) => theme.colors.blue};
    font-weight: 600;
  }
`;
