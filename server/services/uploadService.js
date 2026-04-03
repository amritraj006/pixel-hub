const fs = require('fs/promises');
const path = require('path');

const uploadModel = require('../models/uploadModel');
const createHttpError = require('../utils/httpError');

async function uploadImage({ title, category, description, uploadedBy, file }) {
  if (!title || !category || !description || !uploadedBy || !file) {
    throw createHttpError(400, 'Missing required fields');
  }

  return uploadModel.createImage({
    title,
    category,
    description,
    uploadedBy,
    imageUrl: file.filename,
  });
}

async function getAllImages(userId) {
  return uploadModel.fetchImages(userId);
}

async function toggleLike({ imageId, userId }) {
  if (!imageId || !userId) {
    throw createHttpError(400, 'imageId and userId are required');
  }

  return uploadModel.toggleImageLike(Number(imageId), String(userId));
}

async function getUserPosts(userEmail, userId) {
  if (!userEmail) {
    throw createHttpError(400, 'user_email is required');
  }

  return uploadModel.fetchUserPosts(userEmail, userId);
}

async function removePost(id) {
  const deletedPost = await uploadModel.deleteImage(Number(id));

  if (!deletedPost) {
    throw createHttpError(404, 'Post not found');
  }

  const filePath = path.join(__dirname, '..', 'uploads', deletedPost.image_url);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn('Unable to delete image file:', filePath, error.message);
    }
  }
}

async function editPost(id, { title, category, description }) {
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

async function getUserStats(userEmail) {
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

async function getLatestPosts(userId) {
  return uploadModel.fetchLatestImages(4, userId);
}

module.exports = {
  uploadImage,
  getAllImages,
  toggleLike,
  getUserPosts,
  removePost,
  editPost,
  getUserStats,
  getLatestPosts,
};
