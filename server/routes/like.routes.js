import express from 'express';
import * as likesController from '../controllers/like.controller.js';
import asyncHandler from '../middlewares/async.middleware.js';

const router = express.Router();

router.get('/is-liked', asyncHandler(likesController.isLiked));
router.post('/like', asyncHandler(likesController.like));
router.delete('/unlike', asyncHandler(likesController.unlike));
router.get('/like-count', asyncHandler(likesController.likeCount));
router.get('/liked-images', asyncHandler(likesController.likedImages));

export default router;
