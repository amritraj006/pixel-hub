import * as likesService from '../services/like.service.js';

export async function isLiked(req, res) {
  const liked = await likesService.isLiked(
    req.query.user_email,
    req.query.category,
    req.query.title
  );

  res.json({ liked });
}

export async function like(req, res) {
  await likesService.addLike(
    req.body.user_email,
    req.body.category,
    req.body.title
  );

  res.json({ success: true });
}

export async function unlike(req, res) {
  await likesService.unlike(
    req.body.user_email,
    req.body.category,
    req.body.title
  );

  res.json({ success: true });
}

export async function likeCount(req, res) {
  const count = await likesService.getLikeCount(req.query.user_email);
  res.json({ count });
}

export async function likedImages(req, res) {
  const images = await likesService.getLikedImages(req.query.user_email);
  res.json(images);
}
