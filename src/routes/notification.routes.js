import express from 'express';
import {
    getNotifications, markAsRead, deleteNotification, clearAllNotifications,
} from '../controllers/notification.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyJWT(['user', 'admin']));

router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);
router.delete('/all', clearAllNotifications);
router.delete('/:id', deleteNotification);

export default router;
