import graphqlSchema from './graphql/schema';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { maxAge } from './middlewares/caching';
import { authenticateUser } from './middlewares/authentication';
import path from 'path';
import bodyParser from 'body-parser';
import controllers from './controllers';

export default server => {
  // Body parser.
  server.use(bodyParser.json({ limit: '50mb' }));
  server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  server.use('*', authenticateUser); // populate req.remoteUser if JWT token provided in the request

  server.post('/webhook', controllers.webhook);
  server.get('/api/publishEmail', controllers.api.publishEmail);
  server.get('/api/unfollow', controllers.api.unfollow);
  server.get('/api/reset', controllers.api.reset);

  server.get('/favicon.*', maxAge(300000), (req, res) => {
    return res.sendFile(path.join(__dirname, '../static/images/favicon.png'));
  });

  /**
   * GraphQL
   */
  const graphqlServer = new ApolloServer({
    schema: graphqlSchema,
    introspection: true,
    playground: false,
    // Align with behavior from express-graphql
    context: ({ req }) => {
      return req;
    },
  });

  graphqlServer.applyMiddleware({ app: server, path: '/graphql/v1' });

  server.use('/static', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    next();
  });

  server.use('/_next/static', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    next();
  });
};
