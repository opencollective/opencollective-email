import '../env';

import path from 'path';

import express from 'express';
import next from 'next';
import { get } from 'lodash';
import logger from '../logger';

const { PORT } = process.env;

const port = parseInt(PORT, 10) || 3000;
import routes from './routes';
import pages from './pages';

const nextApp = next({
  dir: path.dirname(__dirname),
  dev: process.env.NODE_ENV !== 'production',
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
    logger.info(`> Ready on http://localhost:${port}`);
  });
});
