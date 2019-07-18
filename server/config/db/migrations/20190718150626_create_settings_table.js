
exports.up = function(knex) {
  return knex.schema.createTable('settings', (table) => {
    table.increments();
    table.integer('alert_hour_start');
    table.integer('alert_hour_end');
    table.integer('alert_minute_start');
    table.integer('alert_minute_end');
    table.integer('max_temp');
    table.integer('min_temp');
    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('settings');
};
