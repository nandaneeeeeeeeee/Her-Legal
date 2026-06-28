import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import AuthService from "../services/auth.services.js";

export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, phone, password, image } = req.body;

    if (!username || !email || !phone || !password) {
        throw new ApiError({ statusCode: 400, message: "All fields are required" });
    }

    const user = await AuthService.registerUser({
        username,
        email,
        phone,
        password,
        image,
    });

    return ApiResponse.success(
        res,
        'User registered successfully. Please check your email for the verification code.',
        { user: user.toCleanObject() }
    );
});

export const verifyEmail = asyncHandler(async (req, res) => {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
        throw new ApiError({ statusCode: 400, message: 'Email and verification code are required' });
    }

    const result = await AuthService.verifyEmail(email, verificationCode);
    return ApiResponse.success(res, 'Email verified successfully', result);
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError({ statusCode: 400, message: "Email and password are required" });
    }

    const result = await AuthService.loginUser({ email, password });

    return ApiResponse.success(res, 'Login successful', {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
    });
});

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError({ statusCode: 400, message: 'Email is required' });
    }

    await AuthService.forgotPassword(email);

    return ApiResponse.success(
        res,
        'If an account exists with this email, a reset code has been sent.'
    );
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { email, resetCode, newPassword, confirmPassword } = req.body;

    if (!email || !resetCode || !newPassword || !confirmPassword) {
        throw new ApiError({ statusCode: 400, message: 'All fields are required' });
    }

    await AuthService.resetPassword(email, resetCode, newPassword, confirmPassword);
    return ApiResponse.success(res, 'Password has been reset successfully');
});

export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
        throw new ApiError({ statusCode: 400, message: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError({ statusCode: 400, message: 'New passwords do not match' });
    }

    if (newPassword.length < 6) {
        throw new ApiError({ statusCode: 400, message: 'New password must be at least 6 characters' });
    }

    const userId = req.user?._id;
    await AuthService.changePassword(userId, currentPassword, newPassword);

    return ApiResponse.success(res, 'Password changed successfully');
});

export const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken || typeof refreshToken !== 'string') {
        throw new ApiError({ statusCode: 400, message: 'Refresh token is required and must be a string' });
    }

    const result = await AuthService.refreshToken(refreshToken);

    return ApiResponse.success(res, 'Token refreshed successfully', {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
    });
});

export const logout = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError({
            statusCode: 401,
            message: 'User authentication required'
        });
    }

    await AuthService.logoutUser(userId);

    return ApiResponse.success(res, 'Logout successful');
});