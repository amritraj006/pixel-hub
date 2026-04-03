const { query } = require('../config/db');

async function addComment(postId, userId, userName, userAvatar, text, parentId) {
  const sql = `
    INSERT INTO comments (post_id, user_id, user_name, user_avatar, text, parent_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const { rows } = await query(sql, [postId, userId, userName, userAvatar, text, parentId || null]);
  return rows[0];
}

async function fetchComments(postId) {
  // Fetch all comments and sort by created_at ascending
  const sql = `
    SELECT * FROM comments 
    WHERE post_id = $1 
    ORDER BY created_at ASC;
  `;
  const { rows } = await query(sql, [postId]);
  return rows;
}

async function deleteComment(id, userId) {
  // Allow deleting if userId matches or if the comment is a child comment deleting by the same user.
  // Realistically we also might want owners to delete, but for now just author.
  const sql = `
    DELETE FROM comments
    WHERE id = $1 AND user_id = $2
    RETURNING *;
  `;
  const { rows } = await query(sql, [id, userId]);
  return rows[0];
}

module.exports = {
  addComment,
  fetchComments,
  deleteComment,
};
