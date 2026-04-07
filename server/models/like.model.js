import { query } from '../config/db.js';

export async function findLike(userEmail, category, title) {
  const { rows } = await query(
    'SELECT id FROM likes WHERE user_email = $1 AND category = $2 AND title = $3',
    [userEmail, category, title]
  );

  return rows[0] || null;
}

export async function createLike(userEmail, category, title) {
  await query(
    `
      INSERT INTO likes (user_email, category, title)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_email, category, title) DO NOTHING
    `,
    [userEmail, category, title]
  );
}

export async function removeLike(userEmail, category, title) {
  await query(
    'DELETE FROM likes WHERE user_email = $1 AND category = $2 AND title = $3',
    [userEmail, category, title]
  );
}

export async function countLikesByUser(userEmail) {
  const { rows } = await query(
    'SELECT COUNT(*)::int AS count FROM likes WHERE user_email = $1',
    [userEmail]
  );

  return rows[0].count;
}

export async function fetchLikedImagesByUser(userEmail) {
  const { rows } = await query(
    `
      SELECT user_email, category, title, created_at
      FROM likes
      WHERE user_email = $1
      ORDER BY created_at DESC
    `,
    [userEmail]
  );

  return rows;
}
