import express from 'express';
import authRoutes from './auth.routes.js';
import chatbotRoutes from './chatbot.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/chatbot', chatbotRoutes);

export default router;