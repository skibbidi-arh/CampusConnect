const Notification = require('../models/Notification');

// GET /api/notifications
// Returns the last 50 notifications for the logged-in user (personal + broadcast)
exports.getMyNotifications = async (req, res) => {
    try {
        const userId = String(req.verifiedUser.user_id);

        const notifications = await Notification.find({
            $or: [
                { recipientId: userId },
                { recipientId: 'all' }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        // Count unread
        const unreadCount = notifications.filter(n => !n.isRead).length;

        res.status(200).json({ success: true, notifications, unreadCount });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ success: false, message: 'Error fetching notifications' });
    }
};

// PATCH /api/notifications/:id/read
exports.markAsRead = async (req, res) => {
    try {
        const userId = String(req.verifiedUser.user_id);
        const { id } = req.params;

        // Only mark as read for notifications belonging to this user or broadcasts
        const notification = await Notification.findOneAndUpdate(
            {
                _id: id,
                $or: [{ recipientId: userId }, { recipientId: 'all' }]
            },
            { $set: { isRead: true } },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.status(200).json({ success: true, notification });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ success: false, message: 'Error updating notification' });
    }
};

// PATCH /api/notifications/read-all
exports.markAllRead = async (req, res) => {
    try {
        const userId = String(req.verifiedUser.user_id);

        await Notification.updateMany(
            {
                $or: [{ recipientId: userId }, { recipientId: 'all' }],
                isRead: false
            },
            { $set: { isRead: true } }
        );

        res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ success: false, message: 'Error updating notifications' });
    }
};
