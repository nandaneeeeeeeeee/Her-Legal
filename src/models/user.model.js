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
            required: true,
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
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
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
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (plain) {
    return bcrypt.compare(plain, this.password);
};

// Used by AuthService wherever a sanitized user object is returned
userSchema.methods.toCleanObject = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.refreshToken;
    delete obj.verificationCode;
    delete obj.verificationCodeExpires;
    delete obj.passwordResetCode;
    delete obj.passwordResetCodeExpires;
    delete obj.passwordResetAttempts;
    delete obj.passwordResetAttemptsExpires;
    delete obj.__v;
    return obj;
};

userSchema.set('toJSON', {
    transform(_, obj) {
        delete obj.password;
        delete obj.refreshToken;
        delete obj.verificationCode;
        delete obj.verificationCodeExpires;
        delete obj.passwordResetCode;
        delete obj.passwordResetCodeExpires;
        delete obj.passwordResetAttempts;
        delete obj.passwordResetAttemptsExpires;
        delete obj.__v;
        return obj;
    },
});

export const User = mongoose.model('User', userSchema);