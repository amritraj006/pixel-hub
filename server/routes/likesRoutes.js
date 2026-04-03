const express = require('express');

const likesController = require('../controllers/likesController');
const asyncHandler = require('../middlewares/asyncHandler');

const router = express.Router();

router.get('/is-liked', asyncHandler(likesController.isLiked));
router.post('/like', asyncHandler(likesController.like));
router.delete('/unlike', asyncHandler(likesController.unlike));
router.get('/like-count', asyncHandler(likesController.likeCount));
router.get('/liked-images', asyncHandler(likesController.likedImages));

module.exports = router;
