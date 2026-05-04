const express = require('express');
const router  = express.Router();
const { getTenants, getTenant, updateTenant, createTenant } = require('../controllers/tenantController');
const { protect }   = require('../middleware/authMiddleware');
const { ownerOnly } = require('../middleware/roleMiddleware');

router.use(protect, ownerOnly);

router.get('/',      getTenants);
router.post('/',     createTenant);
router.get('/:id',   getTenant);
router.put('/:id',   updateTenant);

module.exports = router;