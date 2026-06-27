const Chat = require('../models/Chat');

// Get chat history for a user
const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.find({ userId }).sort({ createdAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Could not get chat history' });
  }
};

// Delete chat history
const deleteChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    await Chat.deleteMany({ userId });
    res.json({ message: 'Chat history deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete chat history' });
  }
};

module.exports = { getChatHistory, deleteChatHistory };