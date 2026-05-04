const db = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

// GET all conversations for logged-in user
const getConversations = async (req, res) => {
  try {
    const [conversations] = await db.query(
      `SELECT 
        m.id, m.content, m.sent_at, m.is_read,
        CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END AS other_user_id,
        u.full_name AS other_user_name, u.role AS other_user_role
       FROM messages m
       JOIN users u ON u.id = CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END
       WHERE m.sender_id = ? OR m.receiver_id = ?
       ORDER BY m.sent_at DESC`,
      [req.user.id, req.user.id, req.user.id, req.user.id]
    );
    return sendSuccess(res, conversations, 'Conversations fetched');
  } catch (err) {
    console.error(err.message);
    return sendError(res, 'Failed to fetch conversations');
  }
};

// GET messages between two users
const getMessages = async (req, res) => {
  try {
    const { other_user_id } = req.params;
    const [messages] = await db.query(
      `SELECT m.*, u.full_name AS sender_name
       FROM messages m
       JOIN users u ON u.id = m.sender_id
       WHERE (m.sender_id = ? AND m.receiver_id = ?)
          OR (m.sender_id = ? AND m.receiver_id = ?)
       ORDER BY m.sent_at ASC`,
      [req.user.id, other_user_id, other_user_id, req.user.id]
    );

    // Mark as read
    await db.query(
      `UPDATE messages SET is_read=1 WHERE receiver_id=? AND sender_id=?`,
      [req.user.id, other_user_id]
    );

    return sendSuccess(res, messages, 'Messages fetched');
  } catch (err) {
    return sendError(res, 'Failed to fetch messages');
  }
};

// SEND message
const sendMessage = async (req, res) => {
  try {
    const { receiver_id, content, property_id, unit_id } = req.body;
    if (!receiver_id || !content)
      return sendError(res, 'Receiver and content are required', 400);

    const [result] = await db.query(
      `INSERT INTO messages (sender_id, receiver_id, content, property_id, unit_id)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, receiver_id, content, property_id, unit_id]
    );
    return sendSuccess(res, { id: result.insertId }, 'Message sent', 201);
  } catch (err) {
    return sendError(res, 'Failed to send message');
  }
};

module.exports = { getConversations, getMessages, sendMessage };