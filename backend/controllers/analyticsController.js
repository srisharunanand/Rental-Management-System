const db = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

const getDashboardStats = async (req, res) => {
  try {
    const owner_id = req.user?.id;
    
    if (!owner_id) {
      return sendError(res, 'User ID not found in token', 401);
    }

    // Total properties
    const [properties] = await db.query(
      `SELECT COUNT(*) as count FROM properties WHERE owner_id = ?`,
      [owner_id]
    );
    const propertyCount = properties[0]?.count || 0;

    // Unit stats
    const [unitData] = await db.query(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as occupied,
        SUM(CASE WHEN status = 'vacant' THEN 1 ELSE 0 END) as vacant
       FROM units
       WHERE property_id IN (SELECT id FROM properties WHERE owner_id = ?)`,
      [owner_id]
    );

    const unitStats = {
      total_units: unitData[0]?.total || 0,
      occupied: unitData[0]?.occupied || 0,
      vacant: unitData[0]?.vacant || 0
    };

    // Payment stats
    const [paymentData] = await db.query(
      `SELECT 
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as collected,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'overdue' THEN amount ELSE 0 END) as overdue
       FROM payments
       WHERE property_id IN (SELECT id FROM properties WHERE owner_id = ?)
       AND MONTH(due_date) = MONTH(CURDATE())
       AND YEAR(due_date) = YEAR(CURDATE())`,
      [owner_id]
    );

    const paymentStats = {
      collected: paymentData[0]?.collected || 0,
      pending: paymentData[0]?.pending || 0,
      overdue: paymentData[0]?.overdue || 0
    };

    // Monthly income
    const [monthlyData] = await db.query(
      `SELECT 
        DATE_FORMAT(due_date, '%b %Y') as month,
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as income
       FROM payments
       WHERE property_id IN (SELECT id FROM properties WHERE owner_id = ?)
       AND due_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
       GROUP BY YEAR(due_date), MONTH(due_date)
       ORDER BY YEAR(due_date), MONTH(due_date)`,
      [owner_id]
    );

    // Open requests
    const [maintenanceData] = await db.query(
      `SELECT COUNT(*) as count
       FROM maintenance_requests
       WHERE property_id IN (SELECT id FROM properties WHERE owner_id = ?)
       AND status NOT IN ('completed', 'resolved', 'cancelled')`,
      [owner_id]
    );

    return sendSuccess(res, {
      properties: propertyCount,
      units: unitStats,
      payments: paymentStats,
      monthly_income: monthlyData || [],
      open_requests: maintenanceData[0]?.count || 0
    }, 'Dashboard stats fetched');

  } catch (err) {
    console.error('Analytics Error:', err.message);
    console.error('Full Error:', err);
    return sendError(res, 'Failed to fetch stats', 500);
  }
};

// Tenant dashboard stats
const getTenantStats = async (req, res) => {
  try {
    const user_id = req.user?.id;
    
    if (!user_id) {
      return sendError(res, 'User ID not found in token', 401);
    }

    const [tenants] = await db.query(
      'SELECT id FROM tenants WHERE user_id = ?', 
      [user_id]
    );
    
    if (!tenants || tenants.length === 0) {
      return sendSuccess(res, {
        lease: null,
        payments: [],
        open_requests: 0
      }, 'No tenant profile found');
    }
    
    const tenant_id = tenants[0].id;

    const [leaseData] = await db.query(
      `SELECT l.*, u.unit_number, u.monthly_rent, p.name, p.address
       FROM leases l
       LEFT JOIN units u ON u.id = l.unit_id
       LEFT JOIN properties p ON p.id = l.property_id
       WHERE l.tenant_id = ? AND l.status = 'active'
       LIMIT 1`,
      [tenant_id]
    );

    const [paymentData] = await db.query(
      `SELECT * FROM payments 
       WHERE tenant_id = ? 
       ORDER BY due_date DESC 
       LIMIT 6`,
      [tenant_id]
    );

    const [maintenanceData] = await db.query(
      `SELECT COUNT(*) as count FROM maintenance_requests 
       WHERE tenant_id = ? AND status NOT IN ('completed', 'resolved', 'cancelled')`,
      [tenant_id]
    );

    return sendSuccess(res, {
      lease: leaseData[0] || null,
      payments: paymentData || [],
      open_requests: maintenanceData[0]?.count || 0
    }, 'Tenant stats fetched');

  } catch (err) {
    console.error('Tenant Analytics Error:', err.message);
    console.error('Full Error:', err);
    return sendError(res, 'Failed to fetch tenant stats', 500);
  }
};

module.exports = { getDashboardStats, getTenantStats };