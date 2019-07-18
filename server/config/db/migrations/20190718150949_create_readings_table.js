
exports.up = function(knex) {
  return knex.schema.createTable('readings', (table) => {
    table.increments();
    table.float('temperature').notNullable();
    table.float('humidity').notNullable();
    table.boolean('alerted');
    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('readings');
};
