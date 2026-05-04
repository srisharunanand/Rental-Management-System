const express = require('express');
const router  = express.Router();
const { getRequests, createRequest, updateRequest } = require('../controllers/maintenanceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/',      getRequests);
router.post('/',     createRequest);
router.put('/:id',   updateRequest);

module.exports = router;