const db = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

const getUnitsByProperty = async (req, res) => {
  try {
    const [units] = await db.query(
      `SELECT u.*, t.id AS tenant_id, us.full_name AS tenant_name
       FROM units u
       LEFT JOIN tenants t ON t.current_unit_id = u.id
       LEFT JOIN users us ON us.id = t.user_id
       WHERE u.property_id = ?
       ORDER BY u.unit_number`,
      [req.params.propertyId]
    );
    return sendSuccess(res, units, 'Units fetched successfully');
  } catch (err) {
    return sendError(res, 'Failed to fetch units');
  }
};

const createUnit = async (req, res) => {
  try {
    const { property_id, unit_number, floor, unit_type, monthly_rent, deposit, size, furnished } = req.body;
    if (!property_id || !unit_number || !unit_type || !monthly_rent || !deposit)
      return sendError(res, 'Required fields missing', 400);

    const [result] = await db.query(
      `INSERT INTO units (property_id, unit_number, floor, unit_type, monthly_rent, deposit, size, furnished)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [property_id, unit_number, floor, unit_type, monthly_rent, deposit, size, furnished || false]
    );
    return sendSuccess(res, { id: result.insertId }, 'Unit created successfully', 201);
  } catch (err) {
    console.error(err.message);
    return sendError(res, 'Failed to create unit');
  }
};

const updateUnit = async (req, res) => {
  try {
    const { unit_number, floor, unit_type, monthly_rent, deposit, size, furnished, status } = req.body;
    await db.query(
      `UPDATE units SET unit_number=?, floor=?, unit_type=?, monthly_rent=?, deposit=?, size=?, furnished=?, status=?
       WHERE id = ?`,
      [unit_number, floor, unit_type, monthly_rent, deposit, size, furnished, status, req.params.id]
    );
    return sendSuccess(res, null, 'Unit updated successfully');
  } catch (err) {
    return sendError(res, 'Failed to update unit');
  }
};

const deleteUnit = async (req, res) => {
  try {
    await db.query('DELETE FROM units WHERE id = ?', [req.params.id]);
    return sendSuccess(res, null, 'Unit deleted successfully');
  } catch (err) {
    return sendError(res, 'Failed to delete unit');
  }
};

module.exports = { getUnitsByProperty, createUnit, updateUnit, deleteUnit };