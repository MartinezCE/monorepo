import Document, { DocumentContext, Html, Main, NextScript, Head } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { Head as SharedHead } from '@wimet/apps-shared';

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
