require('./env');

const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required in server/.env');
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL error:', error);
});

const query = (text, params) => pool.query(text, params);

module.exports = {
  pool,
  query,
};
