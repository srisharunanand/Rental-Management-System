const db = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

// GET all tenants for owner's properties
const getTenants = async (req, res) => {
  try {
    const [tenants] = await db.query(
      `SELECT t.id, u.full_name, u.email, u.phone, u.created_at,
        un.unit_number, p.name AS property_name, t.occupation,
        l.start_date, l.end_date, l.monthly_rent, l.status AS lease_status
       FROM tenants t
       JOIN users u ON u.id = t.user_id
       LEFT JOIN units un ON un.id = t.current_unit_id
       LEFT JOIN properties p ON p.id = t.current_property_id
       LEFT JOIN leases l ON l.tenant_id = t.id AND l.status = 'active'
       WHERE p.owner_id = ? OR t.current_unit_id IS NULL
       GROUP BY t.id
       ORDER BY u.full_name`,
      [req.user.id]
    );
    return sendSuccess(res, tenants, 'Tenants fetched successfully');
  } catch (err) {
    console.error(err.message);
    return sendError(res, 'Failed to fetch tenants');
  }
};

// GET single tenant
const getTenant = async (req, res) => {
  try {
    const [tenants] = await db.query(
      `SELECT t.*, u.full_name, u.email, u.phone, u.address,
        un.unit_number, p.name AS property_name
       FROM tenants t
       JOIN users u ON u.id = t.user_id
       LEFT JOIN units un ON un.id = t.current_unit_id
       LEFT JOIN properties p ON p.id = t.current_property_id
       WHERE t.id = ?`,
      [req.params.id]
    );
    if (tenants.length === 0) return sendError(res, 'Tenant not found', 404);
    return sendSuccess(res, tenants[0]);
  } catch (err) {
    return sendError(res, 'Failed to fetch tenant');
  }
};

// UPDATE tenant (assign unit, update occupation etc.)
const updateTenant = async (req, res) => {
  try {
    const { occupation, id_proof, current_unit_id, current_property_id } = req.body;
    await db.query(
      `UPDATE tenants SET occupation=?, id_proof=?, current_unit_id=?, current_property_id=?
       WHERE id = ?`,
      [occupation, id_proof, current_unit_id, current_property_id, req.params.id]
    );
    // Update unit status
    if (current_unit_id) {
      await db.query(
        `UPDATE units SET status='occupied', is_occupied=1, occupied_since=CURDATE() WHERE id=?`,
        [current_unit_id]
      );
    }
    return sendSuccess(res, null, 'Tenant updated successfully');
  } catch (err) {
    return sendError(res, 'Failed to update tenant');
  }
};

// CREATE new tenant
const createTenant = async (req, res) => {
  try {
    const { name, phone, email, unit_id, monthly_rent, lease_start_date, lease_end_date } = req.body;
    
    // Validate required fields
    if (!name || !phone || !email) {
      return sendError(res, 'Name, phone, and email are required', 400);
    }

    // Create user first
    const [userResult] = await db.query(
      `INSERT INTO users (full_name, email, phone, role) VALUES (?, ?, ?, 'tenant')`,
      [name, email, phone]
    );

    const userId = userResult.insertId;

    // Create tenant
    const [tenantResult] = await db.query(
      `INSERT INTO tenants (user_id, current_unit_id, owner_id) VALUES (?, ?, ?)`,
      [userId, unit_id || null, req.user.id]
    );

    // Create lease if dates provided
    if (lease_start_date && lease_end_date && unit_id) {
      await db.query(
        `INSERT INTO leases (tenant_id, unit_id, start_date, end_date, monthly_rent, status) 
         VALUES (?, ?, ?, ?, ?, 'active')`,
        [tenantResult.insertId, unit_id, lease_start_date, lease_end_date, monthly_rent || 0]
      );
    }

    // Fetch and return the created tenant
    const [newTenant] = await db.query(
      `SELECT t.*, u.full_name, u.email, u.phone FROM tenants t
       JOIN users u ON u.id = t.user_id WHERE t.id = ?`,
      [tenantResult.insertId]
    );

    return sendSuccess(res, newTenant[0], 'Tenant created successfully', 201);
  } catch (err) {
    console.error(err.message);
    return sendError(res, err.message || 'Failed to create tenant');
  }
};

module.exports = { getTenants, getTenant, updateTenant, createTenant };