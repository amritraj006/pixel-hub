import express from 'express';
import * as aiController from '../controllers/ai.controller.js';
import asyncHandler from '../middlewares/async.middleware.js';

const router = express.Router();

router.post('/generate-image', asyncHandler(aiController.generateImage));
router.get('/history/:userId', asyncHandler(aiController.getHistory));
router.delete('/history/:id', asyncHandler(aiController.deleteHistory));

export default router;
