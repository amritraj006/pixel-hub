import { query } from '../config/db.js';

export async function saveHistory(userId, prompt, imageUrl) {
  const sql = `
    INSERT INTO ai_generations (user_id, prompt, image_url)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const { rows } = await query(sql, [userId, prompt, imageUrl]);
  return rows[0];
}

export async function fetchHistory(userId) {
  const sql = `
    SELECT * FROM ai_generations
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;
  const { rows } = await query(sql, [userId]);
  return rows;
}

export async function deleteHistory(id, userId) {
  const sql = `
    DELETE FROM ai_generations
    WHERE id = $1 AND user_id = $2
    RETURNING image_url;
  `;
  const { rows } = await query(sql, [id, userId]);
  return rows[0];
}
