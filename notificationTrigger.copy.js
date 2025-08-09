// File: notificationTrigger.js
// Path: backend/utils/notificationTrigger.js

const { sendNotification } = require('./notificationDispatcher');

/**
 * Trigger a notification when dispute events occur.
 * Also emits a Socket.IO event if io instance is available.
 * @param {Object} options - { type, disputeId, recipientId, message, suppressDuplicates, io (optional) }
 */
exports.triggerDisputeNotification = async ({ type, disputeId, recipientId, message, suppressDuplicates = false, io }) => {
  try {
    const payload = {
      title: `Dispute ${type}`,
      message,
      context: {
        disputeId,
        type,
      },
    };

    const recipients = Array.isArray(recipientId) ? recipientId : [recipientId];

    for (const userId of recipients) {
      const uniqueKey = `${disputeId}-${type}-${userId}`;

      if (suppressDuplicates) {
        const alreadySent = global.__recentNotifications?.has(uniqueKey);
        if (alreadySent) continue;

        global.__recentNotifications = global.__recentNotifications || new Set();
        global.__recentNotifications.add(uniqueKey);

        setTimeout(() => global.__recentNotifications.delete(uniqueKey), 3600000);
      }

      await sendNotification({ ...payload, userId });

      // Emit via Socket.IO if available
      if (io) {
        io.to(userId).emit('notification:new', {
          ...payload,
          userId,
          timestamp: new Date(),
        });
      }
    }
  } catch (error) {
    console.error('Notification trigger failed:', error);
  }
};
