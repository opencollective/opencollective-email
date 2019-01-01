import withCSS from '@zeit/next-css';
import webpack from 'webpack';
import { server } from 'config';

const images = require('remark-images');
const emoji = require('remark-emoji');

const withMDX = require('@zeit/next-mdx')({
  extension: /\.mdx?$/,
  options: {
    mdPlugins: [images, emoji],
  },
});

const nextConfig = {
  onDemandEntries: {
    // Make sure entries are not getting disposed.
    maxInactiveAge: 1000 * 60 * 60,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    COLLECTIVE_DOMAIN: server.domain,
    GRAPHQL_URL: `${server.baseUrl}/graphql/v1`,
  },
  webpack: config => {
    config.plugins.push(
      // Ignore __tests__
      new webpack.IgnorePlugin(/\/__tests__\//),
      // Only include our supported locales
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|fr|es|ja/),
      // Set extra environment variables accessible through process.env.*
      // Will be replaced by webpack by their values!
      new webpack.EnvironmentPlugin({
        DYNAMIC_IMPORT: true,
      }),
    );

    if (process.env.WEBPACK_BUNDLE_ANALYZER) {
      // eslint-disable-next-line node/no-unpublished-require
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          generateStatsFile: true,
          openAnalyzer: false,
        }),
      );
    }
    config.module.rules.push({
      test: /\.md$/,
      use: ['babel-loader', 'raw-loader', 'markdown-loader'],
    });

    // Inspired by https://github.com/rohanray/next-fonts
    // Load Bootstrap and Font-Awesome fonts
    config.module.rules.push({
      test: /fonts\/.*\.(woff|woff2|eot|ttf|otf|svg)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192,
            fallback: 'file-loader',
            publicPath: '/_next/static/fonts/',
            outputPath: 'static/fonts/',
            name: '[name]-[hash].[ext]',
          },
        },
      ],
    });

    // Configuration for static/marketing pages
    config.module.rules.unshift(
      {
        test: /static\/.*\.(html)$/,
        use: {
          loader: 'html-loader',
        },
      },
      {
        test: /.*\.(css)$/,
        use: {
          loader: 'raw-loader',
        },
      },
      {
        test: /static\/.*\.(jpg|gif|png|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/img/',
            outputPath: 'static/img/',
            name: '[name]-[hash].[ext]',
          },
        },
      },
    );

    // Disable the rule forcing react to be bundled in commons chunk
    // Currently needed to skip the react-dom shipped by react-tag-input
    // if (get(config, 'optimization.splitChunks.cacheGroups.react')) {
    //   delete config.optimization.splitChunks.cacheGroups.react;
    // }

    return config;
  },
};

module.exports = withCSS(
  withMDX({
    pageExtensions: ['js', 'jsx', 'mdx'],
    nextConfig,
  }),
);
