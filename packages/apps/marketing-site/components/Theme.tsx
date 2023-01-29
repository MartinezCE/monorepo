import { theme } from '@wimet/apps-shared';
import { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';

export const customTheme = theme;

type ThemeConfig = typeof theme;

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeConfig {} // eslint-disable-line @typescript-eslint/no-empty-interface
}

type ThemeProps = {
  children: ReactNode;
};
const Theme = ({ children }: ThemeProps) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

export default Theme;
