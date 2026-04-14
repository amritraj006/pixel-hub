import { query } from '../config/db.js';

export async function createNotification(userId, senderId, senderName, senderAvatar, type, postId, commentText = null, commentId = null) {
  // Prevent notifying oneself
  if (userId === senderId) return null;

  const sql = `
    INSERT INTO notifications (
      user_id,
      sender_id,
      sender_name,
      sender_avatar,
      recipient_email,
      actor_name,
      actor_avatar,
      type,
      post_id,
      message,
      comment_id
    )
    VALUES ($1, $2, $3, $4, $1, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const { rows } = await query(sql, [userId, senderId, senderName, senderAvatar, type, postId, commentText, commentId]);
  return rows[0];
}

export async function fetchUserNotifications(userId, clerkId = null) {
  const secondaryId = clerkId || userId;
  const sql = `
    SELECT
      n.id,
      COALESCE(n.user_id, n.recipient_email) AS user_id,
      n.sender_id,
      COALESCE(n.sender_name, n.actor_name) AS sender_name,
      COALESCE(n.sender_avatar, n.actor_avatar) AS sender_avatar,
      n.type,
      n.post_id,
      n.is_read,
      n.created_at,
      COALESCE(i.image_url, n.target_url) AS post_image,
      n.message,
      n.comment_id
    FROM notifications n
    LEFT JOIN images i ON n.post_id = i.id
    WHERE COALESCE(n.user_id, n.recipient_email) IN ($1, $2)
    ORDER BY n.created_at DESC
    LIMIT 50;
  `;
  const { rows } = await query(sql, [userId, secondaryId]);
  return rows;
}

export async function markNotificationsAsRead(userId, clerkId = null) {
  const secondaryId = clerkId || userId;
  const sql = `
    UPDATE notifications
    SET is_read = TRUE
    WHERE COALESCE(user_id, recipient_email) IN ($1, $2) AND is_read = FALSE
    RETURNING *;
  `;
  const { rows } = await query(sql, [userId, secondaryId]);
  return rows;
}

export async function getUnreadCount(userId, clerkId = null) {
  const secondaryId = clerkId || userId;
  const sql = `
    SELECT COUNT(*) as count 
    FROM notifications 
    WHERE COALESCE(user_id, recipient_email) IN ($1, $2) AND is_read = FALSE;
  `;
  const { rows } = await query(sql, [userId, secondaryId]);
  return rows[0] ? parseInt(rows[0].count, 10) : 0;
}

export async function deleteAllNotifications(userId, clerkId = null) {
  const secondaryId = clerkId || userId;
  const sql = `
    DELETE FROM notifications
    WHERE COALESCE(user_id, recipient_email) IN ($1, $2)
    RETURNING *;
  `;
  const { rows } = await query(sql, [userId, secondaryId]);
  return rows;
}

export async function deleteNotificationById(id, userId, clerkId = null) {
  const secondaryId = clerkId || userId;
  const sql = `
    DELETE FROM notifications
    WHERE id = $1 AND COALESCE(user_id, recipient_email) IN ($2, $3)
    RETURNING *;
  `;
  const { rows } = await query(sql, [id, userId, secondaryId]);
  return rows[0];
}
