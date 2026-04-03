const express = require('express');

const commentController = require('../controllers/commentController');
const asyncHandler = require('../middlewares/asyncHandler');

const router = express.Router();

router.get('/:postId', asyncHandler(commentController.getComments));
router.post('/', asyncHandler(commentController.addComment));
router.delete('/:id', asyncHandler(commentController.deleteComment));

module.exports = router;
