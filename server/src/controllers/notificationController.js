import { NotificationService } from '../services/notificationService.js';

export class NotificationController {
  static async getNotifications(req, res, next) {
    try {
      const recipientId = req.query.recipientId || (req.user && req.user.profileId);
      const notifications = NotificationService.getNotifications(recipientId);
      const unreadCount = notifications.filter((n) => !n.isRead).length;

      res.json({
        success: true,
        count: notifications.length,
        unreadCount,
        notifications
      });
    } catch (err) {
      next(err);
    }
  }

  static async markAsRead(req, res, next) {
    try {
      const updated = NotificationService.markAsRead(req.params.id);
      res.json({ success: true, notification: updated });
    } catch (err) {
      next(err);
    }
  }

  static async markAllAsRead(req, res, next) {
    try {
      const recipientId = req.body.recipientId || (req.user && req.user.profileId);
      const result = NotificationService.markAllAsRead(recipientId);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
}
