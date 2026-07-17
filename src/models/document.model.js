import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    type: {
        type: String,
        enum: ['notice', 'complaint', 'affidavit', 'agreement', 'application', 'letter', 'other'],
        required: true,
    },
    content: { type: String, required: true },
    formData: { type: mongoose.Schema.Types.Mixed },
    version: { type: Number, default: 1 },
    previousVersions: [{
        content: String,
        version: Number,
        createdAt: Date,
    }],
}, { timestamps: true });

documentSchema.index({ userId: 1, createdAt: -1 });

export const Document = mongoose.model('Document', documentSchema);
