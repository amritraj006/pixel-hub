const likesModel = require('../models/likesModel');
const createHttpError = require('../utils/httpError');

function validateLikePayload(userEmail, category, title) {
  if (!userEmail || !category || !title) {
    throw createHttpError(400, 'user_email, category and title are required');
  }
}

async function isLiked(userEmail, category, title) {
  validateLikePayload(userEmail, category, title);
  const like = await likesModel.findLike(userEmail, category, title);
  return Boolean(like);
}

async function addLike(userEmail, category, title) {
  validateLikePayload(userEmail, category, title);
  await likesModel.createLike(userEmail, category, title);
}

async function unlike(userEmail, category, title) {
  validateLikePayload(userEmail, category, title);
  await likesModel.removeLike(userEmail, category, title);
}

async function getLikeCount(userEmail) {
  if (!userEmail) {
    throw createHttpError(400, 'user_email is required');
  }

  return likesModel.countLikesByUser(userEmail);
}

async function getLikedImages(userEmail) {
  if (!userEmail) {
    throw createHttpError(400, 'user_email is required');
  }

  return likesModel.fetchLikedImagesByUser(userEmail);
}

module.exports = {
  isLiked,
  addLike,
  unlike,
  getLikeCount,
  getLikedImages,
};
