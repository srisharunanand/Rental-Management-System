const express = require('express');
const router  = express.Router();

router.use('/auth',          require('./authRoutes'));
router.use('/properties',    require('./propertyRoutes'));
router.use('/units',         require('./unitRoutes'));
router.use('/tenants',       require('./tenantRoutes'));
router.use('/leases',        require('./leaseRoutes'));
router.use('/payments',      require('./paymentRoutes'));
router.use('/invoices',      require('./invoiceRoutes'));
router.use('/maintenance',   require('./maintenanceRoutes'));
router.use('/messages',      require('./messageRoutes'));
router.use('/analytics',     require('./analyticsRoutes'));
router.use('/notifications', require('./notificationRoutes'));
router.use('/owner',         require('./ownerRoutes'));

module.exports = router;