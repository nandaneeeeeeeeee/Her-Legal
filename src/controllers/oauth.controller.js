import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import OAuthService from "../services/oauth.service.js";

export const googleAuth = asyncHandler(async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) throw new ApiError(400, 'Google ID token is required');

    const result = await OAuthService.googleAuth(idToken);
    return ApiResponse.success(res, 'Google login successful', {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        isNewUser: result.isNewUser,
    });
});

export const sendMagicLink = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new ApiError(400, 'Email is required');

    await OAuthService.sendMagicLink(email);
    return ApiResponse.success(res, 'If an account exists with this email, a magic link has been sent.');
});

export const verifyMagicLink = asyncHandler(async (req, res) => {
    const { token } = req.body;
    if (!token) throw new ApiError(400, 'Magic link token is required');

    const result = await OAuthService.verifyMagicLink(token);
    return ApiResponse.success(res, 'Magic link verified successfully', {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        isNewUser: result.isNewUser,
    });
});
