import express from 'express';
import * as commentController from '../controllers/comment.controller.js';
import asyncHandler from '../middlewares/async.middleware.js';

const router = express.Router();

router.get('/:postId', asyncHandler(commentController.getComments));
router.post('/', asyncHandler(commentController.addComment));
router.delete('/:id', asyncHandler(commentController.deleteComment));

export default router;
