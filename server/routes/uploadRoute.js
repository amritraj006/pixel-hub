const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../cloudinary');

const uploadController = require('../controllers/uploadController');
const asyncHandler = require('../middlewares/asyncHandler');

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pixel-hub-uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
  },
});

const upload = multer({ storage });

router.post(
  '/upload-image',
  upload.single('image'),
  asyncHandler(uploadController.uploadImage)
);
router.get('/fetch-images', asyncHandler(uploadController.fetchImages));
router.post('/toggle-like', asyncHandler(uploadController.toggleLike));
router.get('/user-posts', asyncHandler(uploadController.userPosts));
router.delete('/delete-post/:id', asyncHandler(uploadController.deletePost));
router.put('/edit-post/:id', asyncHandler(uploadController.editPost));
router.get('/user-stats', asyncHandler(uploadController.userStats));
router.get('/latest-posts', asyncHandler(uploadController.latestPosts));

module.exports = router;
