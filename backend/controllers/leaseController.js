const db = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

// GET all leases (owner sees all, tenant sees own)
const getLeases = async (req, res) => {
  try {
    let query, params;
    if (req.user.role === 'owner') {
      query = `SELECT l.*, u.full_name AS tenant_name, u.email AS tenant_email,
                 un.unit_number, p.name AS property_name
               FROM leases l
               JOIN tenants t ON t.id = l.tenant_id
               JOIN users u ON u.id = t.user_id
               JOIN units un ON un.id = l.unit_id
               JOIN properties p ON p.id = l.property_id
               WHERE p.owner_id = ?
               ORDER BY l.created_at DESC`;
      params = [req.user.id];
    } else {
      query = `SELECT l.*, un.unit_number, p.name AS property_name,
                 p.address AS property_address
               FROM leases l
               JOIN tenants t ON t.id = l.tenant_id
               JOIN units un ON un.id = l.unit_id
               JOIN properties p ON p.id = l.property_id
               WHERE t.user_id = ?
               ORDER BY l.created_at DESC`;
      params = [req.user.id];
    }
    const [leases] = await db.query(query, params);
    return sendSuccess(res, leases, 'Leases fetched successfully');
  } catch (err) {
    console.error(err.message);
    return sendError(res, 'Failed to fetch leases');
  }
};

// CREATE lease
const createLease = async (req, res) => {
  try {
    const { tenant_id, unit_id, property_id, start_date, end_date, monthly_rent, security_deposit, rent_cycle, terms } = req.body;
    if (!tenant_id || !unit_id || !property_id || !start_date || !end_date || !monthly_rent)
      return sendError(res, 'Required fields missing', 400);

    const [result] = await db.query(
      `INSERT INTO leases (tenant_id, unit_id, property_id, start_date, end_date, monthly_rent, security_deposit, rent_cycle, terms)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tenant_id, unit_id, property_id, start_date, end_date, monthly_rent, security_deposit, rent_cycle || 'monthly', terms]
    );

    // Update unit to occupied
    await db.query(`UPDATE units SET status='occupied', is_occupied=1 WHERE id=?`, [unit_id]);
    // Update tenant's current unit
    await db.query(`UPDATE tenants SET current_unit_id=?, current_property_id=? WHERE id=?`, [unit_id, property_id, tenant_id]);

    return sendSuccess(res, { id: result.insertId }, 'Lease created successfully', 201);
  } catch (err) {
    console.error(err.message);
    return sendError(res, 'Failed to create lease');
  }
};

// UPDATE lease status
const updateLease = async (req, res) => {
  try {
    const { status, end_date, terms } = req.body;
    await db.query(
      `UPDATE leases SET status=?, end_date=?, terms=? WHERE id=?`,
      [status, end_date, terms, req.params.id]
    );
    return sendSuccess(res, null, 'Lease updated successfully');
  } catch (err) {
    return sendError(res, 'Failed to update lease');
  }
};

module.exports = { getLeases, createLease, updateLease };