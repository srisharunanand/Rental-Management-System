const db = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

// GET all invoices
const getInvoices = async (req, res) => {
  try {
    let query, params;
    if (req.user.role === 'owner') {
      query = `SELECT inv.*, u.full_name AS tenant_name,
                 un.unit_number, p.name AS property_name
               FROM invoices inv
               JOIN tenants t ON t.id = inv.tenant_id
               JOIN users u ON u.id = t.user_id
               JOIN units un ON un.id = inv.unit_id
               JOIN properties p ON p.id = inv.property_id
               WHERE p.owner_id = ?
               ORDER BY inv.created_at DESC`;
      params = [req.user.id];
    } else {
      query = `SELECT inv.*, un.unit_number, p.name AS property_name
               FROM invoices inv
               JOIN tenants t ON t.id = inv.tenant_id
               JOIN units un ON un.id = inv.unit_id
               JOIN properties p ON p.id = inv.property_id
               WHERE t.user_id = ?
               ORDER BY inv.created_at DESC`;
      params = [req.user.id];
    }
    const [invoices] = await db.query(query, params);
    return sendSuccess(res, invoices, 'Invoices fetched successfully');
  } catch (err) {
    console.error(err.message);
    return sendError(res, 'Failed to fetch invoices');
  }
};

// GET single invoice
const getInvoice = async (req, res) => {
  try {
    const [invoices] = await db.query(
      `SELECT inv.*, u.full_name AS tenant_name, u.email AS tenant_email,
         u.phone AS tenant_phone, un.unit_number, p.name AS property_name,
         p.address AS property_address
       FROM invoices inv
       JOIN tenants t ON t.id = inv.tenant_id
       JOIN users u ON u.id = t.user_id
       JOIN units un ON un.id = inv.unit_id
       JOIN properties p ON p.id = inv.property_id
       WHERE inv.id = ?`,
      [req.params.id]
    );
    if (invoices.length === 0) return sendError(res, 'Invoice not found', 404);
    return sendSuccess(res, invoices[0], 'Invoice fetched successfully');
  } catch (err) {
    return sendError(res, 'Failed to fetch invoice');
  }
};

// CREATE invoice
const createInvoice = async (req, res) => {
  try {
    const { tenant_id, property_id, unit_id, lease_id, amount, issue_date, due_date, description } = req.body;
    if (!tenant_id || !property_id || !unit_id || !amount || !issue_date || !due_date)
      return sendError(res, 'Required fields missing', 400);

    const invoice_number = `INV-${Date.now()}`;

    const [result] = await db.query(
      `INSERT INTO invoices (invoice_number, tenant_id, property_id, unit_id, lease_id, amount, issue_date, due_date, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [invoice_number, tenant_id, property_id, unit_id, lease_id, amount, issue_date, due_date, description]
    );
    return sendSuccess(res, { id: result.insertId, invoice_number }, 'Invoice created successfully', 201);
  } catch (err) {
    console.error(err.message);
    return sendError(res, 'Failed to create invoice');
  }
};

// UPDATE invoice status
const updateInvoice = async (req, res) => {
  try {
    const { status, paid_date } = req.body;
    await db.query(
      `UPDATE invoices SET status=?, paid_date=? WHERE id=?`,
      [status, paid_date || null, req.params.id]
    );
    return sendSuccess(res, null, 'Invoice updated successfully');
  } catch (err) {
    return sendError(res, 'Failed to update invoice');
  }
};

// DELETE invoice
const deleteInvoice = async (req, res) => {
  try {
    await db.query(`DELETE FROM invoices WHERE id = ?`, [req.params.id]);
    return sendSuccess(res, null, 'Invoice deleted successfully');
  } catch (err) {
    return sendError(res, 'Failed to delete invoice');
  }
};

module.exports = { getInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice };