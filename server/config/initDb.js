const fs = require('fs');
const path = require('path');

const { query } = require('./db');

const uploadsDir = path.join(__dirname, '..', 'uploads');

async function initializeDatabase() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  await query(`
    CREATE TABLE IF NOT EXISTS images (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      category VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      uploaded_by VARCHAR(255) NOT NULL,
      user_name VARCHAR(255),
      user_avatar TEXT,
      image_url TEXT NOT NULL,
      likes INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Migration: add user_name / user_avatar to existing tables
  await query(`ALTER TABLE images ADD COLUMN IF NOT EXISTS user_name VARCHAR(255);`);
  await query(`ALTER TABLE images ADD COLUMN IF NOT EXISTS user_avatar TEXT;`);

  await query(`
    CREATE TABLE IF NOT EXISTS image_likes (
      id SERIAL PRIMARY KEY,
      image_id INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE,
      user_id VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (image_id, user_id)
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS likes (
      id SERIAL PRIMARY KEY,
      user_email VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      title TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (user_email, category, title)
    );
  `);
}

module.exports = initializeDatabase;
