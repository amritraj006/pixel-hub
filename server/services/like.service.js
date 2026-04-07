import * as likesModel from '../models/like.model.js';
import createHttpError from '../utils/httpError.js';

function validateLikePayload(userEmail, category, title) {
  if (!userEmail || !category || !title) {
    throw createHttpError(400, 'user_email, category and title are required');
  }
}

export async function isLiked(userEmail, category, title) {
  validateLikePayload(userEmail, category, title);
  const like = await likesModel.findLike(userEmail, category, title);
  return Boolean(like);
}

export async function addLike(userEmail, category, title) {
  validateLikePayload(userEmail, category, title);
  await likesModel.createLike(userEmail, category, title);
}

export async function unlike(userEmail, category, title) {
  validateLikePayload(userEmail, category, title);
  await likesModel.removeLike(userEmail, category, title);
}

export async function getLikeCount(userEmail) {
  if (!userEmail) {
    throw createHttpError(400, 'user_email is required');
  }

  return likesModel.countLikesByUser(userEmail);
}

export async function getLikedImages(userEmail) {
  if (!userEmail) {
    throw createHttpError(400, 'user_email is required');
  }

  return likesModel.fetchLikedImagesByUser(userEmail);
}
