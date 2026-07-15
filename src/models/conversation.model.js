import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
}, { timestamps: true });

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, default: 'New conversation' },
  messages: [messageSchema],
}, { timestamps: true });

conversationSchema.pre('save', function (next) {
  if (this.messages.length > 0 && this.title === 'New conversation') {
    const firstMsg = this.messages.find(m => m.role === 'user');
    if (firstMsg) {
      this.title = firstMsg.content.slice(0, 60) + (firstMsg.content.length > 60 ? '...' : '');
    }
  }
  next();
});

export const Conversation = mongoose.model('Conversation', conversationSchema);
