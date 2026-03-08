const Notification = require('../models/Notification');

/**
 * Creates a notification in MongoDB.
 *
 * @param {string} type       - Notification type enum (e.g. 'marketplace', 'event')
 * @param {string} title      - Short title shown in the feed header
 * @param {string} message    - Descriptive body text
 * @param {string|number} recipientId  - Postgres users_id (as string) OR "all" for broadcast
 * @param {object} [metadata] - Optional extra data (postId, eventId, etc.)
 */
const createNotification = async (type, title, message, recipientId, metadata = {}) => {
    try {
        await Notification.create({
            type,
            title,
            message,
            recipientId: String(recipientId),
            metadata
        });
    } catch (error) {
        // Log but do not throw – notifications are non-critical; main request must not fail
        console.error('[Notification] Failed to create notification:', error.message);
    }
};

/**
 * Creates notifications for multiple recipients (bulk personal notifications).
 *
 * @param {string} type
 * @param {string} title
 * @param {string} message
 * @param {Array<string|number>} recipientIds
 * @param {object} [metadata]
 */
const createNotificationForMany = async (type, title, message, recipientIds, metadata = {}) => {
    if (!recipientIds || recipientIds.length === 0) return;
    try {
        const docs = recipientIds.map(id => ({
            type,
            title,
            message,
            recipientId: String(id),
            metadata,
            isRead: false
        }));
        await Notification.insertMany(docs, { ordered: false });
    } catch (error) {
        console.error('[Notification] Failed to create bulk notifications:', error.message);
    }
};

module.exports = { createNotification, createNotificationForMany };
