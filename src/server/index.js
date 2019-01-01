import '../env';
import config from 'config';
import path from 'path';

import express from 'express';
import next from 'next';
import { get } from 'lodash';
import logger from '../logger';

const { PORT } = process.env;

const port = parseInt(PORT, 10) || 3000;
import routes from './routes';
import pages from './pages';
// jest.setup.js
import { nextConfig } from '../next.config';

const nextApp = next({
  dir: path.dirname(__dirname),
  dev: process.env.NODE_ENV !== 'production',
  conf: nextConfig,
});
const pagesHandler = pages.getRequestHandler(nextApp);

nextApp.prepare().then(() => {
  const server = express();
  routes(server);
  server.get('*', pagesHandler);
  server.listen(port, err => {
    if (err) {
      throw err;
    }
    logger.info(
      `> Connecting to pgsql://${config.server.database.options.host}:${config.server.database.port || 5432}/${
        config.server.database.database
      }`,
    );
    logger.info(`> GraphQL server ready on http://localhost:${port}/graphql/v1`);
    logger.info(`> Web server ready on http://localhost:${port}`);
  });
});
