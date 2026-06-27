const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const Chat = require('../models/Chat');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Women-related keywords
const womenTopics = [
  'women', 'woman', 'girl', 'female', 'domestic violence', 'divorce',
  'marriage', 'dowry', 'harassment', 'rape', 'abuse', 'property rights',
  'inheritance', 'maternity', 'custody', 'gender', 'rights', 'legal',
  'mahila', 'nari', 'Nepal law', 'court', 'police', 'FIR'
];

router.post('/chat', async (req, res) => {
  try {
    const { message, userId, isAnonymous } = req.body;

    // Check if anonymous user
    if (isAnonymous || !userId) {
      return res.json({
        response: '⚠️ Please login first to use the legal assistant. Click the Login button in the navigation bar.',
        requiresLogin: true
      });
    }

    // Check if message is women-related
    const isRelevant = womenTopics.some(topic =>
      message.toLowerCase().includes(topic.toLowerCase())
    );

    if (!isRelevant) {
      return res.json({
        response: 'I can only help with women-related legal questions in Nepal. Please ask about topics like domestic violence, marriage, divorce, property rights, harassment, etc.'
      });
    }

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a legal assistant for Her Legal, a platform helping women in Nepal understand their legal rights. Only answer questions related to women\'s legal rights, domestic violence, marriage, divorce, property rights, and harassment laws in Nepal. Be helpful, clear, and supportive.'
        },
        { role: 'user', content: message }
      ]
    });

    const aiResponse = completion.choices[0].message.content;

    // Save to database
    const chat = new Chat({
      userId,
      message,
      response: aiResponse,
      isAnonymous: false
    });
    await chat.save();

    res.json({ response: aiResponse });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

module.exports = router;