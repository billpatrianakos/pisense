
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('settings').del()
    .then(function () {
      // Inserts seed entries
      return knex('settings').insert([
        {
          id: 1,
          alert_hour_start: 20,
          alert_minute_start: 30,
          alert_hour_end: 3,
          alert_minute_end: 0,
          max_temp: 69,
          min_temp: 62
        }
      ]);
    });
};
