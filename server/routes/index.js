import express from 'express';

import aiRoutes from './ai.routes.js';
import uploadRoutes from './upload.routes.js';
import likeRoutes from './like.routes.js';
import commentRoutes from './comment.routes.js';
import notificationRoutes from './notification.routes.js';

const router = express.Router();

router.use('/api/ai', aiRoutes);
router.use('/upload', uploadRoutes);
router.use('/api/likes', likeRoutes);
router.use('/api/comments', commentRoutes);
router.use('/api/notifications', notificationRoutes);

export default router;
