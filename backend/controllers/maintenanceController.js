const db = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

// GET all requests
const getRequests = async (req, res) => {
  try {
    let query, params;
    if (req.user.role === 'owner') {
      query = `SELECT mr.*, u.full_name AS tenant_name, u.phone AS tenant_phone,
                 un.unit_number, p.name AS property_name
               FROM maintenance_requests mr
               JOIN tenants t ON t.id = mr.tenant_id
               JOIN users u ON u.id = t.user_id
               JOIN units un ON un.id = mr.unit_id
               JOIN properties p ON p.id = mr.property_id
               WHERE p.owner_id = ?
               ORDER BY mr.created_at DESC`;
      params = [req.user.id];
    } else {
      query = `SELECT mr.*, un.unit_number, p.name AS property_name
               FROM maintenance_requests mr
               JOIN tenants t ON t.id = mr.tenant_id
               JOIN units un ON un.id = mr.unit_id
               JOIN properties p ON p.id = mr.property_id
               WHERE t.user_id = ?
               ORDER BY mr.created_at DESC`;
      params = [req.user.id];
    }
    const [requests] = await db.query(query, params);
    return sendSuccess(res, requests, 'Requests fetched successfully');
  } catch (err) {
    console.error(err.message);
    return sendError(res, 'Failed to fetch requests');
  }
};

// CREATE request (tenant only)
const createRequest = async (req, res) => {
  try {
    const { title, description, category, priority, unit_id, property_id } = req.body;
    if (!title || !unit_id || !property_id)
      return sendError(res, 'Title, unit and property are required', 400);

    // Get tenant id from user
    const [tenants] = await db.query('SELECT id FROM tenants WHERE user_id = ?', [req.user.id]);
    if (tenants.length === 0) return sendError(res, 'Tenant profile not found', 404);

    const [result] = await db.query(
      `INSERT INTO maintenance_requests (tenant_id, property_id, unit_id, title, description, category, priority)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [tenants[0].id, property_id, unit_id, title, description, category, priority || 'medium']
    );
    return sendSuccess(res, { id: result.insertId }, 'Request submitted successfully', 201);
  } catch (err) {
    console.error(err.message);
    return sendError(res, 'Failed to submit request');
  }
};

// UPDATE request status (owner)
const updateRequest = async (req, res) => {
  try {
    const { status, notes, assigned_to, scheduled_date } = req.body;
    const resolved_date = status === 'resolved' ? new Date().toISOString().split('T')[0] : null;

    await db.query(
      `UPDATE maintenance_requests 
       SET status=?, notes=?, assigned_to=?, scheduled_date=?, resolved_date=?
       WHERE id=?`,
      [status, notes, assigned_to, scheduled_date, resolved_date, req.params.id]
    );
    return sendSuccess(res, null, 'Request updated successfully');
  } catch (err) {
    return sendError(res, 'Failed to update request');
  }
};

module.exports = { getRequests, createRequest, updateRequest };