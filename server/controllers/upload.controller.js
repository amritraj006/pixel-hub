import * as uploadService from '../services/upload.service.js';

export async function uploadImage(req, res) {
  const image = await uploadService.uploadImage({
    title: req.body.title,
    category: req.body.category,
    description: req.body.description,
    uploadedBy: req.body.uploaded_by,
    userName: req.body.user_name || null,
    userAvatar: req.body.user_avatar || null,
    file: req.file,
  });

  res.status(200).json({ message: 'Upload successful', id: image.id });
}

export async function fetchImages(req, res) {
  const images = await uploadService.getAllImages(req.query.user_id);
  res.json(images);
}

export async function toggleLike(req, res) {
  const result = await uploadService.toggleLike(req.body);
  res.json(result);
}

export async function userPosts(req, res) {
  const posts = await uploadService.getUserPosts(req.query.user_email, req.query.user_id);
  res.json(posts);
}

export async function deletePost(req, res) {
  await uploadService.removePost(req.params.id);
  res.json({ message: 'Post and image deleted successfully' });
}

export async function editPost(req, res) {
  await uploadService.editPost(req.params.id, req.body);
  res.json({ message: 'Post updated successfully' });
}

export async function userStats(req, res) {
  const stats = await uploadService.getUserStats(req.query.user_email);
  res.json(stats);
}

export async function latestPosts(req, res) {
  const posts = await uploadService.getLatestPosts(req.query.user_id);
  res.json(posts);
}
