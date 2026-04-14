import * as notificationModel from '../models/notification.model.js';

export async function getNotifications(req, res) {
  const { userId, clerkId } = req.query;
  if (!userId && !clerkId) return res.status(400).json({ error: 'User ID is required' });

  const notifications = await notificationModel.fetchUserNotifications(userId, clerkId);
  res.json({ success: true, data: notifications });
}

export async function markAsRead(req, res) {
  const { userId, clerkId } = req.body;
  if (!userId && !clerkId) return res.status(400).json({ error: 'User ID is required' });

  await notificationModel.markNotificationsAsRead(userId, clerkId);
  res.json({ success: true, message: 'Notifications marked as read' });
}

export async function getUnreadCount(req, res) {
  const { userId, clerkId } = req.query;
  if (!userId && !clerkId) return res.status(400).json({ error: 'User ID is required' });

  const count = await notificationModel.getUnreadCount(userId, clerkId);
  res.json({ success: true, count });
}

export async function clearAllNotifications(req, res) {
  const { userId, clerkId } = req.body;
  if (!userId && !clerkId) return res.status(400).json({ error: 'User ID is required' });

  await notificationModel.deleteAllNotifications(userId, clerkId);
  res.json({ success: true, message: 'All notifications cleared' });
}

export async function deleteNotification(req, res) {
  const { id } = req.params;
  const { userId, clerkId } = req.query;

  if (!id || (!userId && !clerkId)) {
    return res.status(400).json({ error: 'Notification ID and User ID are required' });
  }

  const deleted = await notificationModel.deleteNotificationById(id, userId, clerkId);
  if (!deleted) {
    return res.status(404).json({ error: 'Notification not found or access denied' });
  }

  res.json({ success: true, message: 'Notification deleted' });
}
