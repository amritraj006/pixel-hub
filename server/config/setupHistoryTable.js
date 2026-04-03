const { pool } = require('./db');

async function createTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS ai_generations (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      prompt TEXT NOT NULL,
      image_url TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log('ai_generations table created or already exists.');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    pool.end();
  }
}

createTable();
