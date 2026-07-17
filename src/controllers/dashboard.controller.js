import { Post } from '../models/community.model.js';
import { Conversation } from '../models/conversation.model.js';
import { Document } from '../models/document.model.js';
import { Notification } from '../models/notification.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [conversationCount, documentCount, postCount, savedCount] = await Promise.all([
    Conversation.countDocuments({ userId }),
    Document.countDocuments({ userId }),
    Post.countDocuments({ userId }),
    Post.countDocuments({ savedBy: userId }),
  ]);

  return ApiResponse.success(res, 'Stats fetched', {
    conversations: conversationCount,
    documents: documentCount,
    posts: postCount,
    saved: savedCount,
  });
});

export const getActivity = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [recentConversations, recentDocuments, recentPosts, recentNotifications] = await Promise.all([
    Conversation.find({ userId }).sort({ updatedAt: -1 }).limit(5).select('title updatedAt').lean(),
    Document.find({ userId }).sort({ createdAt: -1 }).limit(5).select('title type createdAt').lean(),
    Post.find({ userId }).sort({ createdAt: -1 }).limit(5).select('title createdAt isAnonymous anonymousIdentity').lean(),
    Notification.find({ userId }).sort({ createdAt: -1 }).limit(5).select('title message type createdAt isRead link').lean(),
  ]);

  const activity = [];

  for (const c of recentConversations) {
    activity.push({
      type: 'conversation',
      text: c.title || 'Chat conversation',
      time: c.updatedAt,
      link: '/chat',
    });
  }
  for (const d of recentDocuments) {
    activity.push({
      type: 'document',
      text: `Created document: ${d.title}`,
      time: d.createdAt,
      link: '/documents',
    });
  }
  for (const p of recentPosts) {
    const label = p.isAnonymous ? 'Anonymous post' : 'Post';
    activity.push({
      type: 'post',
      text: `${label}: ${p.title}`,
      time: p.createdAt,
      link: `/community/${p._id}`,
    });
  }
  for (const n of recentNotifications) {
    activity.push({
      type: 'notification',
      text: n.title,
      time: n.createdAt,
      link: n.link || '/notifications',
    });
  }

  activity.sort((a, b) => new Date(b.time) - new Date(a.time));
  activity.splice(10);

  return ApiResponse.success(res, 'Activity fetched', activity);
});
