import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            minlength: 6,
            select: false,
        },
        phone: {
            type: String,
            match: /^[0-9]{7,15}$/,
            default: null,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        image: {
            type: String,
            default: null,
        },
            authProvider: {
            type: String,
            enum: ['email', 'google', 'magic_link'],
            default: 'email',
        },
        googleId: {
            type: String,
            default: null,
            sparse: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },

        // --- Onboarding ---
        isOnboarded: {
            type: Boolean,
            default: false,
        },
        language: {
            type: String,
            enum: ['en', 'ne'],
            default: 'en',
        },
        interests: [{
            type: String,
        }],
        communityPrefs: {
            anonymousPosting: { type: Boolean, default: true },
            receiveReplies: { type: Boolean, default: true },
            receiveNotifications: { type: Boolean, default: true },
            receiveLegalUpdates: { type: Boolean, default: false },
        },

        // --- Auth/session ---
        refreshToken: {
            type: String,
            default: null,
            select: false,
        },

        // --- Email verification ---
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationCode: {
            type: String,
            default: null,
            select: false,
        },
        verificationCodeExpires: {
            type: Date,
            default: null,
            select: false,
        },

        // --- Password reset ---
        passwordResetCode: {
            type: String,
            default: null,
            select: false,
        },
        passwordResetCodeExpires: {
            type: Date,
            default: null,
            select: false,
        },
        passwordResetAttempts: {
            type: Number,
            default: 0,
            select: false,
        },
        passwordResetAttemptsExpires: {
            type: Date,
            default: null,
            select: false,
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (plain) {
    return bcrypt.compare(plain, this.password);
};

// Used by AuthService wherever a sanitized user object is returned
userSchema.methods.toCleanObject = function () {
    const obj = this.toObject();
    const sensitive = ['password','refreshToken','verificationCode','verificationCodeExpires','passwordResetCode','passwordResetCodeExpires','passwordResetAttempts','passwordResetAttemptsExpires','__v'];
    sensitive.forEach(k => delete obj[k]);
    return obj;
};

userSchema.set('toJSON', {
    transform(_, obj) {
        const sensitive = ['password','refreshToken','verificationCode','verificationCodeExpires','passwordResetCode','passwordResetCodeExpires','passwordResetAttempts','passwordResetAttemptsExpires','__v'];
        sensitive.forEach(k => delete obj[k]);
        return obj;
    },
});

export const User = mongoose.model('User', userSchema);