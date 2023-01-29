import { ReactNode } from 'react';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import theme from '../../common/theme';

export const customTheme = theme;

type ThemeConfig = typeof theme;

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeConfig {} // eslint-disable-line @typescript-eslint/no-empty-interface
}

type ThemeProps = {
  children: ReactNode;
};
const ThemeProvider = ({ children }: ThemeProps) => <SCThemeProvider theme={theme}>{children}</SCThemeProvider>;

export default ThemeProvider;
