import Groq from 'groq-sdk';
import { Chat } from '../models/chat.model.js';
import { Conversation } from '../models/conversation.model.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── AI Chat ───

export const chatWithAI = async (req, res) => {
  try {
    const { message, userId, conversationId, language } = req.body;
    const detectedLang = language || req.language || 'en';

    const languageHint = detectedLang === 'ne'
      ? `The user may write in Nepali (Devanagari script like नमस्ते), romanized Nepali (Nepali words in English alphabet like "mero naam", "kasto cha", "malai maddat chahiyo"), or English. Detect the language or script of the user's message and ALWAYS respond in the same style:
- If the user writes in Devanagari script → respond in Devanagari script
- If the user writes in romanized Nepali (Latin script with Nepali words) → respond in romanized Nepali
- If the user writes in English → respond in English`
      : 'Respond in English.';

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a legal assistant for Her Legal, a platform helping women in Nepal understand their legal rights. Only answer questions related to women legal rights, domestic violence, marriage, divorce, property rights, and harassment laws in Nepal. Be helpful, clear, and supportive. ${languageHint}`
        },
        { role: 'user', content: message }
      ],
      model: 'llama-3.3-70b-versatile',
    });

    const aiResponse = completion.choices[0].message.content;

    if (userId) {
      const chat = new Chat({ userId, message, response: aiResponse, isAnonymous: false });
      await chat.save();

      if (conversationId) {
        const conv = await Conversation.findById(conversationId);
        if (conv && conv.userId.toString() === userId) {
          conv.messages.push({ role: 'user', content: message });
          conv.messages.push({ role: 'assistant', content: aiResponse });
          await conv.save();
        }
      }
    }

    res.json({ response: aiResponse });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
};

// ─── Conversations ───

export const createConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const conv = await Conversation.create({ userId, messages: [] });
    res.status(201).json(conv);
  } catch (error) {
    res.status(500).json({ error: 'Could not create conversation' });
  }
};

export const getConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .select('title createdAt updatedAt');
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch conversations' });
  }
};

export const getConversationMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const conv = await Conversation.findById(id);
    if (!conv) return res.status(404).json({ error: 'Conversation not found' });
    res.json(conv.messages);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch messages' });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    await Conversation.findByIdAndDelete(id);
    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete conversation' });
  }
};

export const renameConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const conv = await Conversation.findByIdAndUpdate(id, { title }, { new: true });
    if (!conv) return res.status(404).json({ error: 'Conversation not found' });
    res.json(conv);
  } catch (error) {
    res.status(500).json({ error: 'Could not rename conversation' });
  }
};

// ─── Legacy Chat History ───

export const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.find({ userId }).sort({ createdAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Could not get chat history' });
  }
};

export const deleteChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    await Chat.deleteMany({ userId });
    res.json({ message: 'Chat history deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete chat history' });
  }
};
