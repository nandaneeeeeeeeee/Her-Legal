import { getJwtConfig } from '../config/jwtConfig.js';
import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { sendMail } from '../utils/mailHandeler.js';
import crypto from 'crypto';

class AuthService {

    static async registerUser(data) {
        const { username, email, phone, password, image } = data;

        const existingUser = await User.findOne({ email });

        if (existingUser && existingUser.isVerified) {
            throw new ApiError(400, 'User already exists with this email');
        }

        if (existingUser && !existingUser.isVerified) {
            await User.deleteOne({ _id: existingUser._id });
        }

        const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
        const verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const user = await User.create({
            username,
            email,
            phone,
            password,
            image: image || null,
            isVerified: false,
            verificationCode,
            verificationCodeExpires,
        });

        const emailBody = `
    <div style="text-align: center; font-family: Arial, sans-serif;">
      <h1>Welcome, ${username}!</h1>
      <p>Please use the following 4-digit code to verify your email:</p>
      <h2 style="color: #4CAF50; letter-spacing: 5px;">${verificationCode}</h2>
      <p>This code is valid for 24 hours.</p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;

        try {
            await sendMail({
                recipientEmail: email,
                subject: 'Verify Your Email',
                emailBody,
            });
        } catch (error) {
            await User.deleteOne({ _id: user._id });
            throw new ApiError(500, 'Failed to send verification email');
        }

        return user;
    }

    static async changePassword(userId, currentPassword, newPassword) {
        const user = await User.findById(userId).select('+password');
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            throw new ApiError(400, 'Current password is incorrect');
        }

        user.password = newPassword;
        await user.save();

        try {
            await sendMail({
                recipientEmail: user.email,
                subject: 'Password Changed',
                emailBody: `
        <div style="text-align: center; font-family: Arial, sans-serif;">
          <h1>Password Changed</h1>
          <p>Hello ${user.username},</p>
          <p>Your password was just changed. If this wasn't you, contact support immediately.</p>
        </div>
      `,
            });
        } catch (error) {
            throw new ApiError(500, 'Password changed but failed to send confirmation email');
        }

        return true;
    }

    static async refreshToken(refreshToken) {
        if (!refreshToken || typeof refreshToken !== 'string') {
            throw new ApiError(400, 'Refresh token is required and must be a string');
        }

        const jwtConfig = getJwtConfig();

        if (!jwtConfig) {
            throw new ApiError(500, 'JWT secret not configured');
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, jwtConfig.refreshToken.secret);

            if (typeof decoded === 'string') {
                throw new ApiError(401, 'Invalid refresh token format');
            }
        } catch (error) {
            throw new ApiError(401, 'Invalid or expired refresh token');
        }

        const user = await User.findById(decoded.userId).select('+refreshToken');
        if (!user) {
            throw new ApiError(401, 'User not found');
        }

        // Ensure the token presented matches the one we last issued (rotation check)
        if (user.refreshToken !== refreshToken) {
            throw new ApiError(401, 'Refresh token does not match');
        }

        const userId = user._id.toString();

        const accessToken = jwt.sign(
            {
                userId: userId,
                email: user.email,
                username: user.username,
                role: user.role,
            },
            jwtConfig.accessToken.secret,
            jwtConfig.accessToken.options
        );

        const newRefreshToken = jwt.sign(
            { userId: userId, role: user.role },
            jwtConfig.refreshToken.secret,
            jwtConfig.refreshToken.options
        );

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        return {
            success: true,
            user: user.toCleanObject(),
            accessToken,
            refreshToken: newRefreshToken,
        };
    }

    static async logoutUser(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        user.refreshToken = null;
        await user.save({ validateBeforeSave: false });

        return { success: true };
    }

    static async forgotPassword(email) {
        const user = await User.findOne({ email }).select(
            '+passwordResetCodeExpires'
        );

        if (!user) {
            return { success: true };
        }

        const now = Date.now();
        if (user.passwordResetCodeExpires && user.passwordResetCodeExpires.getTime() > now) {
            const timeSinceLastRequest = now - (user.passwordResetCodeExpires.getTime() - 15 * 60 * 1000);
            if (timeSinceLastRequest < 2 * 60 * 1000) {
                throw new ApiError(429, 'Please wait before requesting another reset code');
            }
        }

        const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
        const hashedCode = crypto.createHash('sha256').update(resetCode).digest('hex');

        user.passwordResetCode = hashedCode;
        user.passwordResetCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
        user.passwordResetAttempts = 0;
        user.passwordResetAttemptsExpires = new Date(Date.now() + 15 * 60 * 1000);

        await user.save();

        const emailBody = `
      <div style="text-align: center; font-family: Arial, sans-serif;">
        <h1>Password Reset Request</h1>
        <p>Hello ${user.username},</p>
        <p>You requested to reset your password. Use the code below:</p>
        <h2 style="color: #4CAF50; letter-spacing: 5px;">${resetCode}</h2>
        <p>This code is valid for <strong>15 minutes</strong>.</p>
        <p>If you didn't request this, please ignore this email and secure your account.</p>
      </div>
    `;

        try {
            await sendMail({
                recipientEmail: user.email,
                subject: 'Password Reset Code',
                emailBody,
            });
        } catch (error) {
            user.passwordResetCode = undefined;
            user.passwordResetCodeExpires = undefined;
            user.passwordResetAttempts = undefined;
            user.passwordResetAttemptsExpires = undefined;
            await user.save();
            throw new ApiError(500, 'Failed to send password reset email');
        }

        return { success: true };
    }

    static async verifyEmail(email, verificationCode) {
        const user = await User.findOne({ email }).select(
            '+verificationCode +verificationCodeExpires'
        );

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        if (user.isVerified) {
            throw new ApiError(400, 'Email is already verified');
        }

        if (user.verificationCode !== verificationCode) {
            throw new ApiError(400, 'Invalid verification code');
        }

        if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
            throw new ApiError(400, 'Verification code has expired');
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        return user.toCleanObject();
    }

    static async loginUser(data) {
        const { email, password } = data;

        const user = await User.findOne({ email }).select('+password');
        if (!user) throw new ApiError(401, 'Invalid email or password');
        if (!user.isVerified) throw new ApiError(403, 'Please verify your email before logging in');

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) throw new ApiError(401, 'Invalid email or password');

        const jwtConfig = getJwtConfig();

        const payload = {
            userId: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
        };

        const accessToken = jwt.sign(payload, jwtConfig.accessToken.secret, jwtConfig.accessToken.options);
        const refreshToken = jwt.sign(
            { userId: user._id, role: user.role },
            jwtConfig.refreshToken.secret,
            jwtConfig.refreshToken.options
        );

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return {
            success: true,
            user: user.toCleanObject(),
            accessToken,
            refreshToken,
        };
    }

    static async resetPassword(email, resetCode, newPassword, confirmPassword) {
        if (newPassword !== confirmPassword) {
            throw new ApiError(400, 'Passwords do not match');
        }

        const user = await User.findOne({ email }).select(
            '+passwordResetCode +passwordResetCodeExpires +passwordResetAttempts +passwordResetAttemptsExpires'
        );

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        const now = new Date();

        if (
            user.passwordResetAttemptsExpires &&
            user.passwordResetAttemptsExpires > now &&
            user.passwordResetAttempts >= 5
        ) {
            throw new ApiError(429, 'Too many failed reset attempts. Try again later.');
        }

        const hashedInputCode = crypto.createHash('sha256').update(resetCode).digest('hex');

        if (!user.passwordResetCode || user.passwordResetCode !== hashedInputCode) {
            user.passwordResetAttempts = (user.passwordResetAttempts || 0) + 1;

            if (user.passwordResetAttempts >= 5) {
                user.passwordResetAttemptsExpires = new Date(now.getTime() + 30 * 60 * 1000);
            }

            await user.save();
            throw new ApiError(400, 'Invalid reset code');
        }

        if (user.passwordResetCodeExpires && user.passwordResetCodeExpires < now) {
            throw new ApiError(400, 'Reset code has expired');
        }

        user.password = newPassword;
        user.passwordResetCode = null;
        user.passwordResetCodeExpires = null;
        user.passwordResetAttempts = 0;
        user.passwordResetAttemptsExpires = null;

        await user.save();

        try {
            await sendMail({
                recipientEmail: user.email,
                subject: 'Password Reset Successful',
                emailBody: `
          <div style="text-align: center; font-family: Arial, sans-serif;">
            <h1>Password Changed</h1>
            <p>Hello ${user.username},</p>
            <p>Your password has been successfully reset.</p>
            <p>If you didn't make this change, please contact support immediately.</p>
          </div>
        `,
            });
        } catch (error) {
            console.error('Failed to send confirmation email:', error);
        }

        return true;
    }
}

export default AuthService;