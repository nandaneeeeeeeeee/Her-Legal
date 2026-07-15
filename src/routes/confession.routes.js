import express from 'express';
import { Confession } from '../models/confession.model.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { text, isAnonymous } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    const confession = await Confession.create({ text, isAnonymous, userId: req.user?._id || null });
    res.status(201).json(confession);
  } catch (error) {
    res.status(500).json({ error: 'Could not create post' });
  }
});

router.get('/', async (req, res) => {
  try {
    const confessions = await Confession.find().sort({ createdAt: -1 });
    res.json(confessions);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch posts' });
  }
});

router.post('/:id/reply', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Reply text is required' });
    const confession = await Confession.findByIdAndUpdate(
      req.params.id,
      { $push: { replies: { text, author: 'Anonymous' } } },
      { new: true }
    );
    if (!confession) return res.status(404).json({ error: 'Post not found' });
    res.json(confession);
  } catch (error) {
    res.status(500).json({ error: 'Could not add reply' });
  }
});

export default router;
