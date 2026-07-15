import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  author: { type: String, default: 'Anonymous' },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const confessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  text: { type: String, required: true },
  isAnonymous: { type: Boolean, default: true },
  replies: [replySchema],
}, { timestamps: true });

export const Confession = mongoose.model('Confession', confessionSchema);
