import express from 'express';
import authRoutes from './auth.routes.js';
import chatbotRoutes from './chatbot.routes.js';
import confessionRoutes from './confession.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/chatbot', chatbotRoutes);
router.use('/confessions', confessionRoutes);

export default router;