import mongoose from 'mongoose';

const ANONYMOUS_NAMES = [
    'Anonymous Lotus', 'Anonymous Hope', 'Anonymous Citizen',
    'Anonymous Sparrow', 'Anonymous Orchid', 'Anonymous River',
    'Anonymous Ocean', 'Anonymous Star', 'Anonymous Peacock',
    'Anonymous Mountain', 'Anonymous Sun', 'Anonymous Moon',
];

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    author: { type: String, default: 'Anonymous' },
    text: { type: String, required: true, maxlength: 2000 },
    isAnonymous: { type: Boolean, default: true },
    helpfulCount: { type: Number, default: 0 },
    helpfulBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, maxlength: 200 },
    text: { type: String, required: true, maxlength: 10000 },
    category: {
        type: String,
        enum: ['Women\'s Rights', 'Employment', 'Marriage', 'Property',
               'Domestic Violence', 'Cyber Crime', 'Citizenship',
               'Consumer Rights', 'Family Law', 'General'],
        default: 'General',
    },
    tags: [{ type: String }],

    // Anonymous settings
    isAnonymous: { type: Boolean, default: true },
    anonymousIdentity: { type: String, default: null },

    // Moderation
    isFlagged: { type: Boolean, default: false },
    flagReason: { type: String, default: null },
    flaggedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    moderationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved',
    },
    aiModerationNote: { type: String, default: null },

    // Engagement
    comments: [commentSchema],
    reactions: {
        helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        supportive: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        insightful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },

    // Stats
    viewCount: { type: Number, default: 0 },
    saveCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },

    // Saved by users
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

}, { timestamps: true });

postSchema.index({ createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ moderationStatus: 1 });
postSchema.index({ 'reactions.helpful': 1 });

// Assign anonymous identity before saving
postSchema.pre('save', function (next) {
    if (this.isAnonymous && !this.anonymousIdentity) {
        const idx = Math.floor(Math.random() * ANONYMOUS_NAMES.length);
        this.anonymousIdentity = ANONYMOUS_NAMES[idx];
    }
    this.commentCount = this.comments.length;
    next();
});

export const Post = mongoose.model('Post', postSchema);
