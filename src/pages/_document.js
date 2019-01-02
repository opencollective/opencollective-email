import Document, { Head, Main, NextScript } from 'next/document';
import settings from '../../settings.json';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <html>
        <Head>
          <meta name="viewport" content="width=device-width, user-scalable=no" />
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700,900|Rubik" />
          <style>{`
            html {
              font-size: 62.5%;
              height: 100%;
              width: 100%;
            }
            @media(max-width: 600px) {
              html {
                font-size: 55%;
              }
            }
          
            body {
              font-family: "Inter UI", sans-serif;
              font-size: 1.4rem;
              height: 100%;
              margin: 0;
              padding: 0;
              line-height: 1.3;
            }

            a {
              color: rgb(97, 163, 43);
              text-decoration: none;
            }
            a:hover {
              color: #797d80;
              text-decoration: none;
            }
            h2 {
              font-weight: 300;
            }

            input, button {
              font-size: 2rem;
            }
            .content {
              margin: 2rem 1rem;
            }
            .row {
              display: flex;
              margin: 1rem 0;
            }
            .emoji {
              font-size: 64px;
            }
            table {
              margin: 2rem 0;
            }

            .video {
              position: relative;
              padding-top: 56.25% /* Player ratio: 100 / (1280 / 720) */
            }

            .player {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }

            ul.list {
              list-style: none;
              margin: 0;
              padding: 0;
            }
            ul.list li {
              margin: 2rem 0;
            }
            h3 {
              margin-bottom: 0.5rem;
            }

          `}</style>
        </Head>
        <body className="custom_class">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
