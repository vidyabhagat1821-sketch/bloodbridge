import { db } from '../config/db.js';

export class NotificationService {
  static getNotifications(recipientId) {
    if (!recipientId) {
      return db.collection('notifications').find().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return db
      .collection('notifications')
      .find((n) => n.recipientId === recipientId || n.recipientId === 'ALL')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static createNotification({ recipientId, recipientType, title, message, type = 'EMERGENCY_REQUEST', requestId = null }) {
    return db.collection('notifications').insert({
      recipientId,
      recipientType,
      title,
      message,
      type,
      requestId,
      isRead: false
    });
  }

  static markAsRead(notificationId) {
    return db.collection('notifications').update(notificationId, { isRead: true });
  }

  static markAllAsRead(recipientId) {
    const list = db.collection('notifications').find((n) => n.recipientId === recipientId);
    list.forEach((n) => {
      db.collection('notifications').update(n.id, { isRead: true });
    });
    return { success: true, count: list.length };
  }
}
