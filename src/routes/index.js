import express from 'express';
import authRoutes from './auth.routes.js';
import oauthRoutes from './oauth.routes.js';
import chatbotRoutes from './chatbot.routes.js';
import communityRoutes from './community.routes.js';
import notificationRoutes from './notification.routes.js';
import settingsRoutes from './settings.routes.js';
import documentRoutes from './document.routes.js';
import confessionRoutes from './confession.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/auth', oauthRoutes);
router.use('/chatbot', chatbotRoutes);
router.use('/community', communityRoutes);
router.use('/notifications', notificationRoutes);
router.use('/settings', settingsRoutes);
router.use('/documents', documentRoutes);
router.use('/confessions', confessionRoutes);

export default router;
