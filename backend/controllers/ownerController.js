const db = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

// GET full owner dashboard summary
const getOwnerDashboard = async (req, res) => {
  try {
    const owner_id = req.user.id;

    // Properties summary
    const [properties] = await db.query(
      `SELECT p.id, p.name, p.address, p.city, p.type, p.status,
         COUNT(u.id) AS total_units,
         SUM(CASE WHEN u.status='occupied' THEN 1 ELSE 0 END) AS occupied,
         SUM(CASE WHEN u.status='vacant' THEN 1 ELSE 0 END) AS vacant
       FROM properties p
       LEFT JOIN units u ON u.property_id = p.id
       WHERE p.owner_id = ?
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      [owner_id]
    );

    // Recent payments
    const [recentPayments] = await db.query(
      `SELECT pay.id, pay.amount, pay.month, pay.status, pay.payment_date,
         u.full_name AS tenant_name, un.unit_number, p.name AS property_name
       FROM payments pay
       JOIN tenants t ON t.id = pay.tenant_id
       JOIN users u ON u.id = t.user_id
       JOIN units un ON un.id = pay.unit_id
       JOIN properties p ON p.id = pay.property_id
       WHERE p.owner_id = ?
       ORDER BY pay.created_at DESC
       LIMIT 10`,
      [owner_id]
    );

    // Recent maintenance requests
    const [recentRequests] = await db.query(
      `SELECT mr.id, mr.title, mr.priority, mr.status, mr.created_at,
         u.full_name AS tenant_name, un.unit_number, p.name AS property_name
       FROM maintenance_requests mr
       JOIN tenants t ON t.id = mr.tenant_id
       JOIN users u ON u.id = t.user_id
       JOIN units un ON un.id = mr.unit_id
       JOIN properties p ON p.id = mr.property_id
       WHERE p.owner_id = ?
       ORDER BY mr.created_at DESC
       LIMIT 5`,
      [owner_id]
    );

    // Expiring leases (within 30 days)
    const [expiringLeases] = await db.query(
      `SELECT l.id, l.end_date, l.monthly_rent,
         u.full_name AS tenant_name, un.unit_number, p.name AS property_name
       FROM leases l
       JOIN tenants t ON t.id = l.tenant_id
       JOIN users u ON u.id = t.user_id
       JOIN units un ON un.id = l.unit_id
       JOIN properties p ON p.id = l.property_id
       WHERE p.owner_id = ?
         AND l.status = 'active'
         AND l.end_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
       ORDER BY l.end_date ASC`,
      [owner_id]
    );

    // Payment totals this month
    const [monthlyStats] = await db.query(
      `SELECT
         SUM(CASE WHEN pay.status='paid' THEN pay.amount ELSE 0 END) AS collected,
         SUM(CASE WHEN pay.status='pending' THEN pay.amount ELSE 0 END) AS pending,
         SUM(CASE WHEN pay.status='overdue' THEN pay.amount ELSE 0 END) AS overdue
       FROM payments pay
       JOIN properties p ON p.id = pay.property_id
       WHERE p.owner_id = ?
         AND MONTH(pay.due_date) = MONTH(CURDATE())
         AND YEAR(pay.due_date) = YEAR(CURDATE())`,
      [owner_id]
    );

    return sendSuccess(res, {
      properties,
      recent_payments:  recentPayments,
      recent_requests:  recentRequests,
      expiring_leases:  expiringLeases,
      monthly_stats:    monthlyStats[0]
    }, 'Owner dashboard fetched successfully');

  } catch (err) {
    console.error(err.message);
    return sendError(res, 'Failed to fetch dashboard');
  }
};

// GET owner profile with stats
const getOwnerProfile = async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT id, full_name, email, phone, address, profile_picture, created_at
       FROM users WHERE id = ?`,
      [req.user.id]
    );
    if (users.length === 0) return sendError(res, 'Owner not found', 404);

    const [stats] = await db.query(
      `SELECT COUNT(*) AS total_properties FROM properties WHERE owner_id = ?`,
      [req.user.id]
    );

    return sendSuccess(res, { ...users[0], ...stats[0] }, 'Owner profile fetched');
  } catch (err) {
    return sendError(res, 'Failed to fetch owner profile');
  }
};

module.exports = { getOwnerDashboard, getOwnerProfile };