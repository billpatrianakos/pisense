
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('readings').del()
    .then(function () {
      // Inserts seed entries
      return knex('readings').insert([
        { id: 1, temperature: 70.9, humidity: 51.5, alerted: false, created_at: Date.now(), updated_at: Date.now() }
      ]);
    });
};
