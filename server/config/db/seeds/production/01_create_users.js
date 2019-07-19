// User seeds
// ==========
const _      = require('lodash');
const config = _.merge(require('../../../application').defaults, require('../../../application').production);
const bcrypt = require('bcrypt');

exports.seed = (knex) => {
  // Delete all existing users before seeding
  return knex('users').del()
    .then(() => bcrypt.hash(config.defaultPassword, 12))
    .then((hash) => {
      return knex('users').insert([
        {
          id: 1,
          username: config.defaultUsername,
          password: hash
        }
      ]);
    });
};
