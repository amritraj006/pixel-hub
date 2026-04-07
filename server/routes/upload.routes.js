import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import * as uploadController from '../controllers/upload.controller.js';
import asyncHandler from '../middlewares/async.middleware.js';

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

export default router;
