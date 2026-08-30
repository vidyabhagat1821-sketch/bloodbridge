import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController.js';

const router = Router();

router.get('/', NotificationController.getNotifications);
router.put('/:id/read', NotificationController.markAsRead);
router.put('/read-all', NotificationController.markAllAsRead);

export default router;
