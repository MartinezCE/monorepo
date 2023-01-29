import styled from 'styled-components';
import { theme } from '../../common';

export type ChipThemes = 'disabled' | 'success' | 'error';

type ChipProps = {
    chipTheme: ChipThemes;
};

type ChipWrapperProps = Pick<ChipProps, 'chipTheme'>

const ChipThemes = {
    disabled: theme.colors.gray,
    success: theme.colors.success,
    error: theme.colors.error,
}

const ChipWrapper = styled.div<ChipWrapperProps>`
  padding: 8px;
  border: solid 1px ${({ chipTheme }) => ChipThemes[chipTheme] };
  border-radius: 5px;
  color: ${({ chipTheme }) => ChipThemes[chipTheme] };
  text-transform: capitalize;
  width: 97px;
  text-align: center;
`;

ChipWrapper.defaultProps = {
    chipTheme: 'disabled',
}

const Chip: React.FC<ChipProps> = ({ children, chipTheme }) => (
  <ChipWrapper {...{chipTheme}}>
    {children}
  </ChipWrapper>
);

export default Chip;
