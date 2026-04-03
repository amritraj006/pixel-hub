const { pool, query } = require('../config/db');

async function createImage(payload) {
  const sql = `
    INSERT INTO images (title, category, description, uploaded_by, image_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
  `;

  const values = [
    payload.title,
    payload.category,
    payload.description,
    payload.uploadedBy,
    payload.imageUrl,
  ];

  const { rows } = await query(sql, values);
  return rows[0];
}

async function fetchImages(userId) {
  const sql = `
    SELECT i.*, 
           EXISTS (SELECT 1 FROM image_likes l WHERE l.image_id = i.id AND l.user_id = $1) as is_liked
    FROM images i 
    ORDER BY i.created_at DESC;
  `;
  const { rows } = await query(sql, [userId || null]);
  return rows;
}

async function fetchLatestImages(limit, userId) {
  const sql = `
    SELECT i.*, 
           EXISTS (SELECT 1 FROM image_likes l WHERE l.image_id = i.id AND l.user_id = $2) as is_liked
    FROM images i 
    ORDER BY i.created_at DESC 
    LIMIT $1;
  `;
  const { rows } = await query(sql, [limit, userId || null]);
  return rows;
}

async function fetchUserPosts(userEmail, userId) {
  const sql = `
    SELECT i.*, 
           EXISTS (SELECT 1 FROM image_likes l WHERE l.image_id = i.id AND l.user_id = $2) as is_liked
    FROM images i 
    WHERE i.uploaded_by = $1 
    ORDER BY i.created_at DESC;
  `;
  const { rows } = await query(sql, [userEmail, userId || null]);
  return rows;
}

async function fetchUserStats(userEmail) {
  const sql = `
    SELECT
      COUNT(*)::int AS "totalPosts",
      COALESCE(SUM(likes), 0)::int AS "totalLikes",
      (
        SELECT category
        FROM images
        WHERE uploaded_by = $1
        GROUP BY category
        ORDER BY COUNT(*) DESC, category ASC
        LIMIT 1
      ) AS "popularCategory",
      ROUND((COALESCE(SUM(likes), 0)::numeric / GREATEST(COUNT(*), 1)), 2) AS "engagementRate"
    FROM images
    WHERE uploaded_by = $1;
  `;

  const { rows } = await query(sql, [userEmail]);
  return rows[0];
}

async function updateImage(id, payload) {
  const sql = `
    UPDATE images
    SET title = $1, category = $2, description = $3
    WHERE id = $4
    RETURNING id;
  `;

  const { rows } = await query(sql, [
    payload.title,
    payload.category,
    payload.description,
    id,
  ]);

  return rows[0];
}

async function deleteImage(id) {
  const { rows } = await query(
    'DELETE FROM images WHERE id = $1 RETURNING image_url',
    [id]
  );
  return rows[0];
}

async function toggleImageLike(imageId, userId) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const existingLike = await client.query(
      'SELECT id FROM image_likes WHERE image_id = $1 AND user_id = $2',
      [imageId, userId]
    );

    if (existingLike.rows.length > 0) {
      await client.query(
        'DELETE FROM image_likes WHERE image_id = $1 AND user_id = $2',
        [imageId, userId]
      );

      await client.query(
        'UPDATE images SET likes = GREATEST(likes - 1, 0) WHERE id = $1',
        [imageId]
      );

      await client.query('COMMIT');
      return { liked: false };
    }

    await client.query(
      'INSERT INTO image_likes (image_id, user_id) VALUES ($1, $2)',
      [imageId, userId]
    );

    await client.query(
      'UPDATE images SET likes = likes + 1 WHERE id = $1',
      [imageId]
    );

    await client.query('COMMIT');
    return { liked: true };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  createImage,
  fetchImages,
  fetchLatestImages,
  fetchUserPosts,
  fetchUserStats,
  updateImage,
  deleteImage,
  toggleImageLike,
};
