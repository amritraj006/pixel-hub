import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../config/cloudinary.js';
import * as uploadModel from '../models/upload.model.js';
import createHttpError from '../utils/httpError.js';
import * as notificationModel from '../models/notification.model.js';
import { getIO } from '../socket.js';
import { pool } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function uploadImage({ title, category, description, uploadedBy, userName, userAvatar, file }) {
  if (!title || !category || !description || !uploadedBy || !file) {
    throw createHttpError(400, 'Missing required fields');
  }

  return uploadModel.createImage({
    title,
    category,
    description,
    uploadedBy,
    userName,
    userAvatar,
    imageUrl: file.path,
  });
}

export async function getAllImages(userId) {
  return uploadModel.fetchImages(userId);
}

export async function toggleLike({ imageId, userId, userEmail, userName, userAvatar }) {
  if (!imageId || !userId) {
    throw createHttpError(400, 'imageId and userId are required');
  }

  const result = await uploadModel.toggleImageLike(Number(imageId), String(userId));
  let newLikeCount = 0;

  try {
    const io = getIO();

    // Get the updated like count from DB
    const { rows: countRows } = await pool.query('SELECT likes FROM images WHERE id = $1', [imageId]);
    newLikeCount = countRows[0]?.likes ?? 0;

    // Broadcast real-time like count to ALL viewers of this post (REMOVED as per request)
    // io.to(`post_${imageId}`).emit('like_updated', { postId: Number(imageId), likeCount: newLikeCount });

    if (result.liked) {
      // Find the post to know who uploaded it
      const { rows } = await pool.query('SELECT uploaded_by FROM images WHERE id = $1', [imageId]);
      const postOwnerEmail = rows[0]?.uploaded_by;

      if (postOwnerEmail && postOwnerEmail !== userId && postOwnerEmail !== userEmail) { // Prevent self-notify
        const notification = await notificationModel.createNotification(
          postOwnerEmail,
          userId,
          userName || 'Anonymous',
          userAvatar || '',
          'like',
          imageId
        );

        if (notification) {
          io.to(postOwnerEmail).emit('new-notification', notification);
        }
      }
    }
  } catch (err) {
    console.error('Error sending like notification:', err);
  }

  return { ...result, newLikeCount };
}

export async function getUserPosts(userEmail, userId) {
  if (!userEmail) {
    throw createHttpError(400, 'user_email is required');
  }

  return uploadModel.fetchUserPosts(userEmail, userId);
}

export async function removePost(id) {
  const deletedPost = await uploadModel.deleteImage(Number(id));

  if (!deletedPost) {
    throw createHttpError(404, 'Post not found');
  }

  if (deletedPost.image_url.includes('cloudinary.com')) {
    try {
      const urlParts = deletedPost.image_url.split('/');
      const filename = urlParts[urlParts.length - 1];
      const publicId = `pixel-hub-uploads/${filename.split('.')[0]}`;
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.warn('Unable to delete image from Cloudinary:', deletedPost.image_url, error.message);
    }
  } else {
    const filePath = path.join(__dirname, '..', 'uploads', deletedPost.image_url);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.warn('Unable to delete image file:', filePath, error.message);
      }
    }
  }
}

export async function editPost(id, { title, category, description }) {
  if (!title || !category || !description) {
    throw createHttpError(400, 'title, category and description are required');
  }

  const updatedPost = await uploadModel.updateImage(Number(id), {
    title,
    category,
    description,
  });

  if (!updatedPost) {
    throw createHttpError(404, 'Post not found');
  }
}

export async function getUserStats(userEmail) {
  if (!userEmail) {
    throw createHttpError(400, 'user_email is required');
  }

  const stats = await uploadModel.fetchUserStats(userEmail);

  return {
    totalPosts: stats?.totalPosts || 0,
    totalLikes: stats?.totalLikes || 0,
    popularCategory: stats?.popularCategory || '',
    engagementRate: Number(stats?.engagementRate || 0),
  };
}

export async function getLatestPosts(userId) {
  return uploadModel.fetchLatestImages(3, userId);
}
