import { css } from 'styled-components';

const primaryVariant = css`
  &,
  .react-select__control {
    height: 50px;
  }

  .react-select__control {
    border: 1px solid ${({ theme }) => theme.colors.gray};
  }

  .react-select__control--is-focused,
  .react-select__control:hover {
    box-shadow: unset;
    border: 1px solid ${({ theme }) => theme.colors.blue};
  }

  .react-select__value-container {
    height: 100%;
    padding: 15px 24px;
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
    font-size: ${({ theme }) => theme.fontSizes[2]} !important;
    font-weight: 300 !important;
  }

  .react-select__indicator {
    padding-right: 24px;
  }
`;

export default primaryVariant;
