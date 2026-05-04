const express = require('express');
const router  = express.Router();
const { getOwnerDashboard, getOwnerProfile } = require('../controllers/ownerController');
const { protect }   = require('../middleware/authMiddleware');
const { ownerOnly } = require('../middleware/roleMiddleware');

router.use(protect, ownerOnly);

router.get('/dashboard', getOwnerDashboard);
router.get('/profile',   getOwnerProfile);

module.exports = router;