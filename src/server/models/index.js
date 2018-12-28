/**
 * Dependencies.
 */
import pg from 'pg';
import Sequelize from 'sequelize';
import { server } from 'config';
import debug from 'debug';

const config = server.database;

// this is needed to prevent sequelize from converting integers to strings, when model definition isn't clear
// like in case of the key totalOrders and raw query (like User.getTopBackers())
pg.defaults.parseInt8 = true;

/**
 * Database connection.
 */
console.log(`Connecting to postgres://${config.options.host}/${config.database}`);

// If we launch the process with DEBUG=psql, we log the postgres queries
if (process.env.DEBUG && process.env.DEBUG.match(/psql/)) {
  config.options.logging = true;
}

if (config.options.logging) {
  if (process.env.NODE_ENV === 'production') {
    config.options.logging = (query, executionTime) => {
      if (executionTime > 50) {
        debug('psql')(query.replace(/(\n|\t| +)/g, ' ').slice(0, 100), '|', executionTime, 'ms');
      }
    };
  } else {
    config.options.logging = (query, executionTime) => {
      debug('psql')(
        '\n-------------------- <query> --------------------\n',
        query,
        `\n-------------------- </query executionTime="${executionTime}"> --------------------\n`,
      );
    };
  }
}

config.options.operatorsAliases = false;

export const sequelize = new Sequelize(config.database, config.username, config.password, config.options);

/**
 * Separate function to be able to use in scripts
 */
export function setupModels(client) {
  const m = {}; // models

  /**
   * Models.
   */

  ['User', 'Group', 'Activity', 'Member', 'Post'].forEach(model => {
    m[model] = client.import(`${__dirname}/${model}`);
  });

  Object.keys(m).forEach(modelName => m[modelName].associate && m[modelName].associate(m));

  return m;
}

const models = setupModels(sequelize);
export default models;
export const Op = Sequelize.Op;
