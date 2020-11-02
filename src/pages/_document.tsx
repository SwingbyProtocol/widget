import Document from 'next/document';
import { ServerStyleSheet } from 'styled-components';

import { logger } from '../modules/logger';
import { swapNodeEndpoints, indexerEthereumEndpoint, indexerBitcoinEndpoint } from '../modules/env';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    logger.info(
      { swapNodeEndpoints, indexerEthereumEndpoint, indexerBitcoinEndpoint },
      '_document.tsx',
    );

    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
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
}
