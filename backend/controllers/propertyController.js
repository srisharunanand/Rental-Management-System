const db = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

const getProperties = async (req, res) => {
  try {
    const [properties] = await db.query(
      `SELECT p.*,
         COUNT(u.id) AS total_units,
         SUM(CASE WHEN u.status='occupied' THEN 1 ELSE 0 END) AS occupied_units,
         SUM(CASE WHEN u.status='vacant' THEN 1 ELSE 0 END) AS vacant_units
       FROM properties p
       LEFT JOIN units u ON u.property_id = p.id
       WHERE p.owner_id = ?
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    return sendSuccess(res, properties, 'Properties fetched successfully');
  } catch (err) {
    console.error(err.message);
    return sendError(res, 'Failed to fetch properties');
  }
};

const getProperty = async (req, res) => {
  try {
    const [properties] = await db.query(
      `SELECT * FROM properties WHERE id = ? AND owner_id = ?`,
      [req.params.id, req.user.id]
    );
    if (properties.length === 0) return sendError(res, 'Property not found', 404);
    return sendSuccess(res, properties[0]);
  } catch (err) {
    return sendError(res, 'Failed to fetch property');
  }
};

const createProperty = async (req, res) => {
  try {
    const { name, address, city, state, pincode, type, total_units, description, amenities } = req.body;
    if (!name || !address || !type) return sendError(res, 'Name, address and type are required', 400);

    const [result] = await db.query(
      `INSERT INTO properties (owner_id, name, address, city, state, pincode, type, total_units, description, amenities)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, name, address, city, state, pincode, type, total_units || 0, description, JSON.stringify(amenities || [])]
    );
    return sendSuccess(res, { id: result.insertId }, 'Property created successfully', 201);
  } catch (err) {
    console.error(err.message);
    return sendError(res, 'Failed to create property');
  }
};

const updateProperty = async (req, res) => {
  try {
    const { name, address, city, state, pincode, type, total_units, description, status } = req.body;
    await db.query(
      `UPDATE properties SET name=?, address=?, city=?, state=?, pincode=?, type=?, total_units=?, description=?, status=?
       WHERE id = ? AND owner_id = ?`,
      [name, address, city, state, pincode, type, total_units, description, status, req.params.id, req.user.id]
    );
    return sendSuccess(res, null, 'Property updated successfully');
  } catch (err) {
    return sendError(res, 'Failed to update property');
  }
};

const deleteProperty = async (req, res) => {
  try {
    await db.query(
      `DELETE FROM properties WHERE id = ? AND owner_id = ?`,
      [req.params.id, req.user.id]
    );
    return sendSuccess(res, null, 'Property deleted successfully');
  } catch (err) {
    return sendError(res, 'Failed to delete property');
  }
};

module.exports = { getProperties, getProperty, createProperty, updateProperty, deleteProperty };