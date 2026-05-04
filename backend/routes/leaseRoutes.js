const express = require('express');
const router  = express.Router();
const { getLeases, createLease, updateLease } = require('../controllers/leaseController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/',      getLeases);
router.post('/',     createLease);
router.put('/:id',   updateLease);

module.exports = router;