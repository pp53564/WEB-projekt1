const pgp = require('pg-promise')();

const db = pgp({
   connectionString: 'postgres://postgres:bazepodataka@localhost:5433/ProjectAuth0',
   user: 'postgres',
   password: 'bazepodataka',
   ssl: process.env.NODE_ENV === 'production',
});

module.exports = db;
