import { css } from 'styled-components';
import secondaryVariant from './secondaryVariant';

const tertiaryVariant = css`
  ${secondaryVariant}

  .react-select__placeholder,
  .react-select__single-value,
  .react-select__input {
    font-size: ${({ theme }) => theme.fontSizes[4]};
    line-height: ${({ theme }) => theme.lineHeights[2]};
    font-weight: ${({ theme }) => theme.fontWeight[2]};
  }

  > div {
    width: fit-content;
  }
`;

export default tertiaryVariant;
