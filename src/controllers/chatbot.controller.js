import Groq from 'groq-sdk';
import { Chat } from '../models/chat.model.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const womenTopics = [
  'women', 'woman', 'girl', 'female', 'domestic violence', 'divorce',
  'marriage', 'dowry', 'harassment', 'rape', 'abuse', 'property',
  'inheritance', 'maternity', 'custody', 'gender', 'rights', 'legal',
  'court', 'police', 'fir', 'widow', 'alimony', 'assault', 'protection',
  'shelter', 'mahila', 'nari', 'law', 'violence'
];

const isWomenRelated = (message) => {
  return womenTopics.some(topic =>
    message.toLowerCase().includes(topic.toLowerCase())
  );
};

export const chatWithAI = async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!isWomenRelated(message)) {
      return res.json({
        response: 'I can only help with women-related legal questions in Nepal. Please ask about domestic violence, marriage, divorce, property rights, or harassment.'
      });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a legal assistant for Her Legal, a platform helping women in Nepal understand their legal rights. Only answer questions related to women legal rights, domestic violence, marriage, divorce, property rights, and harassment laws in Nepal. Be helpful, clear, and supportive.'
        },
        { role: 'user', content: message }
      ],
      model: 'llama-3.3-70b-versatile',
    });

    const aiResponse = completion.choices[0].message.content;

    if (userId) {
      const chat = new Chat({
        userId,
        message,
        response: aiResponse,
        isAnonymous: false
      });
      await chat.save();
    }

    res.json({ response: aiResponse });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
};

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