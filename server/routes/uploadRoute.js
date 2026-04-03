const express = require('express');
const multer = require('multer');
const path = require('path');

const uploadController = require('../controllers/uploadController');
const asyncHandler = require('../middlewares/asyncHandler');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`),
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
