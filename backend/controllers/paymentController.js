const db = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

// GET payments (owner sees all, tenant sees own)
const getPayments = async (req, res) => {
  try {
    let query, params;
    if (req.user.role === 'owner') {
      query = `SELECT pay.*, u.full_name AS tenant_name,
                 un.unit_number, p.name AS property_name
               FROM payments pay
               JOIN tenants t ON t.id = pay.tenant_id
               JOIN users u ON u.id = t.user_id
               JOIN units un ON un.id = pay.unit_id
               JOIN properties p ON p.id = pay.property_id
               WHERE p.owner_id = ?
               ORDER BY pay.due_date DESC`;
      params = [req.user.id];
    } else {
      query = `SELECT pay.*, un.unit_number, p.name AS property_name
               FROM payments pay
               JOIN tenants t ON t.id = pay.tenant_id
               JOIN units un ON un.id = pay.unit_id
               JOIN properties p ON p.id = pay.property_id
               WHERE t.user_id = ?
               ORDER BY pay.due_date DESC`;
      params = [req.user.id];
    }
    const [payments] = await db.query(query, params);
    return sendSuccess(res, payments, 'Payments fetched successfully');
  } catch (err) {
    console.error(err.message);
    return sendError(res, 'Failed to fetch payments');
  }
};

// CREATE payment
const createPayment = async (req, res) => {
  try {
    const { lease_id, tenant_id, property_id, unit_id, amount, month, due_date, method } = req.body;
    if (!lease_id || !amount || !month || !due_date)
      return sendError(res, 'Required fields missing', 400);

    const receipt_number = `RCP-${Date.now()}`;

    const [result] = await db.query(
      `INSERT INTO payments (lease_id, tenant_id, property_id, unit_id, amount, month, due_date, method, receipt_number)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [lease_id, tenant_id, property_id, unit_id, amount, month, due_date, method, receipt_number]
    );
    return sendSuccess(res, { id: result.insertId, receipt_number }, 'Payment created', 201);
  } catch (err) {
    console.error(err.message);
    return sendError(res, 'Failed to create payment');
  }
};

// UPDATE payment status (mark as paid)
const updatePayment = async (req, res) => {
  try {
    const { status, method, transaction_id, notes } = req.body;
    const payment_date = status === 'paid' ? new Date().toISOString().split('T')[0] : null;

    await db.query(
      `UPDATE payments SET status=?, method=?, transaction_id=?, notes=?, payment_date=? WHERE id=?`,
      [status, method, transaction_id, notes, payment_date, req.params.id]
    );
    return sendSuccess(res, null, 'Payment updated successfully');
  } catch (err) {
    return sendError(res, 'Failed to update payment');
  }
};

// GET payment summary stats
const getPaymentStats = async (req, res) => {
  try {
    const [stats] = await db.query(
      `SELECT 
        SUM(CASE WHEN pay.status='paid' THEN pay.amount ELSE 0 END) AS total_collected,
        SUM(CASE WHEN pay.status='pending' THEN pay.amount ELSE 0 END) AS total_pending,
        SUM(CASE WHEN pay.status='overdue' THEN pay.amount ELSE 0 END) AS total_overdue,
        COUNT(CASE WHEN pay.status='paid' THEN 1 END) AS paid_count,
        COUNT(CASE WHEN pay.status='pending' THEN 1 END) AS pending_count,
        COUNT(CASE WHEN pay.status='overdue' THEN 1 END) AS overdue_count
       FROM payments pay
       JOIN properties p ON p.id = pay.property_id
       WHERE p.owner_id = ?`,
      [req.user.id]
    );
    return sendSuccess(res, stats[0], 'Stats fetched');
  } catch (err) {
    return sendError(res, 'Failed to fetch stats');
  }
};

module.exports = { getPayments, createPayment, updatePayment, getPaymentStats };