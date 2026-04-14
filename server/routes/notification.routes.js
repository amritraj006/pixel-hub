import express from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import asyncHandler from '../middlewares/async.middleware.js';

const router = express.Router();

router.get('/', asyncHandler(notificationController.getNotifications));
router.put('/read', asyncHandler(notificationController.markAsRead));
router.get('/unread-count', asyncHandler(notificationController.getUnreadCount));
router.post('/clear-all', asyncHandler(notificationController.clearAllNotifications));
router.delete('/:id', asyncHandler(notificationController.deleteNotification));

export default router;
