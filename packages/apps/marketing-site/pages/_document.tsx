import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { Head as SharedHead } from '@wimet/apps-shared';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <html lang='en' dir='ltr'>
        <Head>
          <SharedHead />
        </Head>
        <body>
          <Html />
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}