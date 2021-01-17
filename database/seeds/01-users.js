
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { username: 'Dwaine', password: 'password', department: 'Central Nursing' },
        { username: 'Jade', password: 'abc123', department: 'Human Resources' },
        { username: 'Matthew', password: 'admin', department: 'Business Office' },
      ]);
    });
};
