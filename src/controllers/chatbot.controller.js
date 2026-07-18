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
      ? `You are a legal assistant for women in Nepal. Respond in Nepali or English, whichever best matches the user's message. Accept and understand Nepali in Devanagari script, Latin/romanized Nepali, and English. Never answer in Hindi. Do not mix Hindi words. If the user writes in Devanagari Nepali, respond in Devanagari Nepali. If the user writes in romanized Nepali or Latin script, respond in romanized Nepali or simple Nepali. If the user writes in English, respond in clear English. If the user mixes Nepali and English, keep the answer in the same mixed style. Keep the response concise, empathetic, and legally relevant. If the question is urgent or about violence, encourage immediate safety steps and suggest contacting local authorities or support services.`
      : 'Respond in clear English.';

    const systemPrompt = `You are Her Legal's trusted legal support assistant for women in Nepal. Your job is to provide general legal information, practical guidance, and supportive next steps related to women’s rights, domestic violence, marriage, divorce, property rights, harassment, workplace issues, and access to justice in Nepal. Do not give personalized legal advice as a substitute for a lawyer. If the situation involves immediate danger, abuse, or urgent legal risk, advise the user to seek help from police, a shelter, a legal aid service, or a qualified lawyer. Always stay respectful, non-judgmental, and calm. ${languageHint}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
      max_completion_tokens: 300,
    });

    let aiResponse = completion.choices[0].message.content || '';
    aiResponse = aiResponse.trim();

    if (detectedLang === 'ne') {
      aiResponse = aiResponse.replace(/\b(hindi|हिंदी|Hindi)\b/gi, 'नेपाली');
    }

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
    console.log('[createConv] userId:', userId, typeof userId);
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const conv = await Conversation.create({ userId, messages: [] });
    res.status(201).json(conv);
  } catch (error) {
    console.error('Create conversation error:', error.message);
    console.error('Full error:', error);
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
