const commentModel = require('../models/commentModel');

async function getComments(req, res) {
  const { postId } = req.params;
  const comments = await commentModel.fetchComments(postId);
  res.json({ success: true, count: comments.length, data: comments });
}

async function addComment(req, res) {
  const { postId, userId, userName, userAvatar, text, parentId } = req.body;
  
  if (!postId || !userId || !text) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const comment = await commentModel.addComment(postId, userId, userName, userAvatar, text, parentId);
  res.status(201).json({ success: true, data: comment });
}

async function deleteComment(req, res) {
  const { id } = req.params;
  const { userId } = req.body;

  const deleted = await commentModel.deleteComment(id, userId);
  if (!deleted) {
    return res.status(403).json({ success: false, message: 'Not authorized or comment not found' });
  }

  res.json({ success: true, data: deleted });
}

module.exports = {
  getComments,
  addComment,
  deleteComment,
};
