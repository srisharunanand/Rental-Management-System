const db = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

const getNotifications = async (req, res) => {
  try {
    const [notifications] = await db.query(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`,
      [req.user.id]
    );
    return sendSuccess(res, notifications, 'Notifications fetched');
  } catch (err) {
    return sendError(res, 'Failed to fetch notifications');
  }
};

const markAsRead = async (req, res) => {
  try {
    await db.query(
      `UPDATE notifications SET is_read=1 WHERE id=? AND user_id=?`,
      [req.params.id, req.user.id]
    );
    return sendSuccess(res, null, 'Marked as read');
  } catch (err) {
    return sendError(res, 'Failed to update notification');
  }
};

const markAllRead = async (req, res) => {
  try {
    await db.query(
      `UPDATE notifications SET is_read=1 WHERE user_id=?`,
      [req.user.id]
    );
    return sendSuccess(res, null, 'All notifications marked as read');
  } catch (err) {
    return sendError(res, 'Failed to update notifications');
  }
};

module.exports = { getNotifications, markAsRead, markAllRead };