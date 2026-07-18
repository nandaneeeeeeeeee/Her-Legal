import { Notification } from '../models/notification.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const getNotifications = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notifications = await Notification.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

    const unreadCount = await Notification.countDocuments({
        userId: req.user._id,
        isRead: false,
    });

    return ApiResponse.success(res, 'Notifications fetched', { notifications, unreadCount });
});

export const markAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (id === 'all') {
        await Notification.updateMany(
            { userId: req.user._id, isRead: false },
            { isRead: true }
        );
        return ApiResponse.success(res, 'All notifications marked as read');
    }

    const notif = await Notification.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        { isRead: true },
        { new: true }
    );
    if (!notif) throw new ApiError(404, 'Notification not found');

    return ApiResponse.success(res, 'Notification marked as read');
});

export const deleteNotification = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (id === 'all') {
        await Notification.deleteMany({ userId: req.user._id });
        return ApiResponse.success(res, 'All notifications deleted');
    }

    const notif = await Notification.findOneAndDelete({
        _id: id,
        userId: req.user._id,
    });
    if (!notif) throw new ApiError(404, 'Notification not found');

    return ApiResponse.success(res, 'Notification deleted');
});
