const _      = require('lodash');
const config = _.merge(require('../../../application').defaults, require('../../../application').production);

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('settings').del()
    .then(function () {
      // Inserts seed entries
      return knex('settings').insert([
        {
          id: 1,
          alert_hour_start: config.settings.alert_hour_start,
          alert_minute_start: config.settings.alert_minute_start,
          alert_hour_end: config.settings.alert_hour_end,
          alert_minute_end: config.settings.alert_minute_end,
          max_temp: config.settings.max_temp,
          min_temp: config.settings.min_temp
        }
      ]);
    });
};
