import { Post } from '../models/community.model.js';
import { Notification } from '../models/notification.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

// ─── POSTS ───

export const createPost = asyncHandler(async (req, res) => {
    const { title, text, category, tags, isAnonymous } = req.body;
    if (!title || !text) {
        throw new ApiError(400, 'Title and text are required');
    }

    const post = await Post.create({
        userId: req.user._id,
        title,
        text,
        category: category || 'General',
        tags: tags || [],
        isAnonymous: isAnonymous !== undefined ? isAnonymous : true,
    });

    return ApiResponse.success(res, 'Post created', post, 201);
});

export const getPosts = asyncHandler(async (req, res) => {
    const { sort = 'latest', category, page = 1, limit = 20 } = req.query;

    const filter = { moderationStatus: 'approved' };
    if (category && category !== 'all') filter.category = category;

    let sortOption = { createdAt: -1 };
    if (sort === 'trending') sortOption = { viewCount: -1, 'reactions.helpful': -1 };
    if (sort === 'popular') sortOption = { commentCount: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const posts = await Post.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-comments -flaggedBy -savedBy')
        .lean();

    const total = await Post.countDocuments(filter);

    return ApiResponse.success(res, 'Posts fetched', { posts, total, page: parseInt(page) });
});

export const getPost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) throw new ApiError(404, 'Post not found');

    post.viewCount += 1;
    await post.save({ validateBeforeSave: false });

    const userReacted = {};
    if (req.user) {
        const uid = req.user._id.toString();
        for (const [type, users] of Object.entries(post.reactions)) {
            userReacted[type] = users.some(u => u.toString() === uid);
        }
        userReacted.saved = post.savedBy.some(u => u.toString() === uid);
    }

    return ApiResponse.success(res, 'Post fetched', {
        post: {
            ...post.toObject(),
            reactionCounts: {
                helpful: post.reactions.helpful.length,
                supportive: post.reactions.supportive.length,
                insightful: post.reactions.insightful.length,
            },
            userReacted,
        },
    });
});

export const getMyPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .lean();
    return ApiResponse.success(res, 'My posts', posts);
});

export const getSavedPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({ savedBy: req.user._id })
        .sort({ createdAt: -1 })
        .select('-comments -flaggedBy -savedBy')
        .lean();
    return ApiResponse.success(res, 'Saved posts', posts);
});

export const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) throw new ApiError(404, 'Post not found');
    if (post.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, 'Not authorized');
    }
    await Post.findByIdAndDelete(req.params.id);
    return ApiResponse.success(res, 'Post deleted');
});

// ─── REACTIONS ───

export const reactToPost = asyncHandler(async (req, res) => {
    const { type } = req.body;
    const validTypes = ['helpful', 'supportive', 'insightful'];
    if (!validTypes.includes(type)) throw new ApiError(400, 'Invalid reaction type');

    const post = await Post.findById(req.params.id);
    if (!post) throw new ApiError(404, 'Post not found');

    const userId = req.user._id;
    const idx = post.reactions[type].indexOf(userId);

    const isReacted = idx === -1;

    if (idx > -1) {
        post.reactions[type].splice(idx, 1);
    } else {
        post.reactions[type].push(userId);
    }

    await post.save({ validateBeforeSave: false });

    // Notify author on reaction
    if (isReacted && post.userId.toString() !== userId.toString()) {
        await Notification.create({
            userId: post.userId,
            type: 'reaction',
            title: `${req.user.username} found your post ${type}`,
            message: `"${post.title.slice(0, 100)}"`,
            link: `/community/${post._id}`,
        }).catch(() => {});
    }

    return ApiResponse.success(res, 'Reaction updated', {
        type,
        count: post.reactions[type].length,
        reacted: isReacted,
    });
});

// ─── SAVE / UNSAVE ───

export const savePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) throw new ApiError(404, 'Post not found');

    const userId = req.user._id;
    const idx = post.savedBy.indexOf(userId);

    if (idx > -1) {
        post.savedBy.splice(idx, 1);
        post.saveCount = Math.max(0, post.saveCount - 1);
    } else {
        post.savedBy.push(userId);
        post.saveCount += 1;
    }

    await post.save({ validateBeforeSave: false });

    return ApiResponse.success(res, 'Save updated', { saved: idx === -1 });
});

// ─── REPORT ───

export const reportPost = asyncHandler(async (req, res) => {
    const { reason } = req.body;
    if (!reason) throw new ApiError(400, 'Report reason is required');

    const post = await Post.findById(req.params.id);
    if (!post) throw new ApiError(404, 'Post not found');

    const userId = req.user._id;
    if (post.flaggedBy.includes(userId)) {
        throw new ApiError(400, 'Already reported this post');
    }

    post.flaggedBy.push(userId);
    post.isFlagged = true;
    post.flagReason = reason;
    post.moderationStatus = 'pending';
    await post.save({ validateBeforeSave: false });

    return ApiResponse.success(res, 'Post reported');
});

// ─── COMMENTS ───

export const addComment = asyncHandler(async (req, res) => {
    const { text, isAnonymous } = req.body;
    if (!text) throw new ApiError(400, 'Comment text is required');

    const post = await Post.findById(req.params.id);
    if (!post) throw new ApiError(404, 'Post not found');

    const comment = {
        userId: req.user._id,
        author: isAnonymous !== false ? 'Anonymous' : req.user.username,
        text,
        isAnonymous: isAnonymous !== false,
    };

    post.comments.push(comment);
    post.commentCount = post.comments.length;
    await post.save();

    // Notify author on comment
    if (post.userId.toString() !== req.user._id.toString()) {
        await Notification.create({
            userId: post.userId,
            type: 'reply',
            title: `${comment.author} commented on your post`,
            message: `"${text.slice(0, 120)}"`,
            link: `/community/${post._id}`,
        }).catch(() => {});
    }

    return ApiResponse.success(res, 'Comment added', post.comments[post.comments.length - 1], 201);
});

export const getComments = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id).select('comments');
    if (!post) throw new ApiError(404, 'Post not found');

    return ApiResponse.success(res, 'Comments fetched', post.comments);
});

export const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const post = await Post.findById(req.params.id);
    if (!post) throw new ApiError(404, 'Post not found');

    const comment = post.comments.id(commentId);
    if (!comment) throw new ApiError(404, 'Comment not found');

    if (comment.userId?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, 'Not authorized');
    }

    comment.deleteOne();
    post.commentCount = post.comments.length;
    await post.save();

    return ApiResponse.success(res, 'Comment deleted');
});
