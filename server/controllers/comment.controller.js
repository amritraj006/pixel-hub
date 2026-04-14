import * as commentModel from '../models/comment.model.js';

import * as notificationModel from '../models/notification.model.js';
import { getIO } from '../socket.js';
import { pool } from '../config/db.js';

export async function getComments(req, res) {
  const { postId } = req.params;
  const comments = await commentModel.fetchComments(postId);
  res.json({ success: true, count: comments.length, data: comments });
}

export async function addComment(req, res) {
  const { postId, userId, userEmail, userName, userAvatar, text, parentId } = req.body;
  
  if (!postId || !userId || !text) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const comment = await commentModel.addComment(postId, userId, userName, userAvatar, text, parentId);
  
  try {
    const io = getIO();
    
    // Emit comment to the post room so people viewing it see it immediately
    io.to(`post_${postId}`).emit('new-comment', comment);

    // Find post owner to send notification
    const { rows } = await pool.query('SELECT uploaded_by FROM images WHERE id = $1', [postId]);
    const postOwnerEmail = rows[0]?.uploaded_by;

    if (postOwnerEmail && postOwnerEmail !== userId && postOwnerEmail !== userEmail) {
      const notification = await notificationModel.createNotification(
        postOwnerEmail,
        userId,
        userName || 'Anonymous',
        userAvatar || '',
        'comment',
        postId,
        text  // store the comment text so notification page can show a preview
      );

      if (notification) {
        io.to(postOwnerEmail).emit('new-notification', notification);
      }
    }

    // NEW: If this is a reply, notify the parent comment owner
    if (parentId) {
      const parentComment = await commentModel.fetchCommentById(parentId);
      if (parentComment && parentComment.user_id !== userId && parentComment.user_id !== userEmail) {
        const replyNotif = await notificationModel.createNotification(
          parentComment.user_id, // original commenter
          userId, // replier
          userName || 'Anonymous',
          userAvatar || '',
          'reply',
          postId,
          text,
          parentId // the ID of the comment being replied to
        );

        if (replyNotif) {
          io.to(parentComment.user_id).emit('new-notification', replyNotif);
        }
      }
    }
  } catch (err) {
    console.error('Error handling comment real-time update:', err);
  }

  res.status(201).json({ success: true, data: comment });
}

export async function deleteComment(req, res) {
  const { id } = req.params;
  const { userId } = req.body;

  const deleted = await commentModel.deleteComment(id, userId);
  if (!deleted) {
    return res.status(403).json({ success: false, message: 'Not authorized or comment not found' });
  }

  res.json({ success: true, data: deleted });
}
