const _       = require('lodash');
const config  = _.merge(require('./server/config/application').defaults, require('./server/config/application')[process.env.NODE_ENV || 'development']);

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
    migrations: {
      directory: './server/config/db/migrations'
    },
    seeds: {
      directory: './server/config/db/seeds/dev'
    }
  },

  production: {
    client: config.database.client,
    connection: config.database.connection,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './server/config/db/migrations'
    },
    seeds: {
      directory: './server/config/db/seeds/production'
    }
  }

};
