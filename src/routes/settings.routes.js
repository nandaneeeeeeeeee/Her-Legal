import express from 'express';
import { User } from '../models/user.model.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

const router = express.Router();

router.use(verifyJWT(['user', 'admin']));

// Get profile
router.get('/profile', asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    return ApiResponse.success(res, 'Profile fetched', user.toCleanObject());
}));

// Update profile
router.put('/profile', asyncHandler(async (req, res) => {
    const { username, phone, image } = req.body;
    const updates = {};
    if (username !== undefined) updates.username = username;
    if (phone !== undefined) updates.phone = phone;
    if (image !== undefined) updates.image = image;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        updates,
        { new: true, runValidators: true }
    );
    if (!user) throw new ApiError(404, 'User not found');

    return ApiResponse.success(res, 'Profile updated', user.toCleanObject());
}));

// Update community preferences
router.put('/preferences', asyncHandler(async (req, res) => {
    const { language, interests, communityPrefs } = req.body;
    const updates = {};
    if (language !== undefined) updates.language = language;
    if (interests !== undefined) updates.interests = interests;
    if (communityPrefs !== undefined) updates.communityPrefs = communityPrefs;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        updates,
        { new: true, runValidators: true }
    );

    return ApiResponse.success(res, 'Preferences updated', user.toCleanObject());
}));

// Complete onboarding
router.post('/onboarding', asyncHandler(async (req, res) => {
    const { language, interests, communityPrefs } = req.body;
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            isOnboarded: true,
            language: language || 'en',
            interests: interests || [],
            communityPrefs: communityPrefs || {},
        },
        { new: true }
    );
    return ApiResponse.success(res, 'Onboarding completed', user.toCleanObject());
}));

export default router;
