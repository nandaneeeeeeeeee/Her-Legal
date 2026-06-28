import express from 'express';
import { chatWithAI, getChatHistory, deleteChatHistory } from '../controllers/chatbot.controller.js';

const router = express.Router();

router.post('/chat', chatWithAI);
router.get('/history/:userId', getChatHistory);
router.delete('/history/:userId', deleteChatHistory);

export default router;