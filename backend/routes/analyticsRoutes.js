const express = require('express');
const router  = express.Router();
const { getDashboardStats, getTenantStats } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/owner',  getDashboardStats);
router.get('/tenant', getTenantStats);

module.exports = router;