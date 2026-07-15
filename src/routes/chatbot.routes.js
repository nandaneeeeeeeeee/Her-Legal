import express from 'express';
import {
  chatWithAI, getChatHistory, deleteChatHistory,
  createConversation, getConversations, getConversationMessages,
  deleteConversation, renameConversation
} from '../controllers/chatbot.controller.js';

const router = express.Router();

router.post('/chat', chatWithAI);
router.get('/history/:userId', getChatHistory);
router.delete('/history/:userId', deleteChatHistory);

router.post('/conversations', createConversation);
router.get('/conversations/:userId', getConversations);
router.get('/conversation/:id', getConversationMessages);
router.delete('/conversation/:id', deleteConversation);
router.patch('/conversation/:id', renameConversation);

export default router;