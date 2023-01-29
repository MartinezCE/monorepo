import theme from './src/common/theme';

type ThemeConfig = typeof theme;

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeConfig {} // eslint-disable-line @typescript-eslint/no-empty-interface
}

declare module 'react-apexcharts';

declare module 'rosaenlg-pluralize-es';
