import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { getJwtConfig } from '../config/jwtConfig.js';
import { sendMail } from '../utils/mailHandeler.js';
import { ApiError } from '../utils/ApiError.js';

const googleClient = process.env.GOOGLE_CLIENT_ID
    ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    : null;

class OAuthService {

    static async googleAuth(idToken) {
        if (!googleClient) {
            throw new ApiError(500, 'Google authentication is not configured');
        }

        let payload;
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            payload = ticket.getPayload();
        } catch (error) {
            throw new ApiError(401, 'Invalid Google ID token');
        }

        const { sub: googleId, email, name, picture } = payload;
        if (!email) throw new ApiError(400, 'Google account has no email');

        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
                if (picture && !user.image) user.image = picture;
                if (name && !user.username) user.username = name;
                if (!user.authProvider || user.authProvider === 'email') user.authProvider = 'google';
                await user.save({ validateBeforeSave: false });
            }
        } else {
            const baseName = name || email.split('@')[0];
            user = await User.create({
                username: baseName.length < 3 ? `user_${baseName}` : baseName,
                email,
                image: picture || null,
                googleId,
                authProvider: 'google',
                isVerified: true,
            });
        }

        const tokens = this._generateTokens(user);
        user.refreshToken = tokens.refreshToken;
        await user.save({ validateBeforeSave: false });

        return {
            user: user.toCleanObject(),
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isNewUser: user.createdAt && (Date.now() - new Date(user.createdAt).getTime() < 10000),
        };
    }

    static async sendMagicLink(email) {
        const user = await User.findOne({ email });

        const token = jwt.sign(
            { email, purpose: 'magic_link' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const magicUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/magic?token=${token}`;

        const emailBody = `
            <div style="text-align:center;font-family:Arial,sans-serif;padding:40px 20px;max-width:480px;margin:0 auto;">
                <h1 style="color:#C8102E;">Sign in to Her Legal</h1>
                <p style="color:#6B7280;font-size:15px;line-height:1.6;margin:16px 0 32px;">
                    Click the button below to sign in. This link expires in 15 minutes.
                </p>
                <a href="${magicUrl}"
                   style="display:inline-block;background:#C8102E;color:#fff;padding:14px 40px;
                          border-radius:9999px;text-decoration:none;font-weight:600;font-size:15px;">
                    Sign In to Her Legal
                </a>
                <p style="color:#9CA3AF;font-size:13px;margin-top:32px;">
                    If you didn't request this, you can safely ignore this email.
                </p>
            </div>
        `;

        try {
            await sendMail({
                recipientEmail: email,
                subject: 'Sign in to Her Legal',
                emailBody,
            });
        } catch (error) {
            if (!user) return { success: true };
            throw new ApiError(500, 'Failed to send magic link email');
        }

        return { success: true };
    }

    static async verifyMagicLink(token) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new ApiError(401, 'Invalid or expired magic link');
        }

        if (decoded.purpose !== 'magic_link' || !decoded.email) {
            throw new ApiError(401, 'Invalid magic link token');
        }

        const email = decoded.email;
        let user = await User.findOne({ email });
        let isNewUser = false;

        if (!user) {
            const baseName = email.split('@')[0];
            user = await User.create({
                username: baseName.length < 3 ? `user_${baseName}` : baseName,
                email,
                authProvider: 'magic_link',
                isVerified: true,
            });
            isNewUser = true;
        }

        const tokens = this._generateTokens(user);
        user.refreshToken = tokens.refreshToken;
        await user.save({ validateBeforeSave: false });

        return {
            user: user.toCleanObject(),
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isNewUser,
        };
    }

    static _generateTokens(user) {
        const jwtConfig = getJwtConfig();
        const payload = {
            userId: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
        };

        return {
            accessToken: jwt.sign(payload, jwtConfig.accessToken.secret, jwtConfig.accessToken.options),
            refreshToken: jwt.sign(
                { userId: user._id, role: user.role },
                jwtConfig.refreshToken.secret,
                jwtConfig.refreshToken.options
            ),
        };
    }
}

export default OAuthService;
