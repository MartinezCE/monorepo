import { css } from 'styled-components';

const secondaryVariant = css`
  &,
  .react-select__control {
    height: fit-content;
    min-height: auto;
  }

  .react-select__control {
    border: unset;
    background-color: unset;
    column-gap: 8px;
    cursor: pointer;
  }

  .react-select__control--is-focused,
  .react-select__control:hover {
    box-shadow: unset;
    border: unset;
  }

  .react-select__value-container {
    height: 100%;
    padding: 0;
  }

  .react-select__single-value {
    display: flex;
    align-items: center;
  }

  .react-select__single-value,
  .react-select__input-container {
    height: 100%;
    padding: 0;
    margin: 0;
  }

  .react-select__placeholder,
  .react-select__single-value,
  .react-select__input {
    color: ${({ theme }) => theme.colors.darkGray};
    font-size: ${({ theme }) => theme.fontSizes[2]} !important;
    line-height: ${({ theme }) => theme.lineHeights[1]};
    font-weight: 300 !important;
  }

  .react-select__indicators {
    color: ${({ theme }) => theme.colors.darkGray};
    padding: 0;
  }
`;

export default secondaryVariant;
