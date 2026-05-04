const express = require('express');
const router  = express.Router();
const { getUnitsByProperty, createUnit, updateUnit, deleteUnit } = require('../controllers/unitController');
const { protect }   = require('../middleware/authMiddleware');
const { ownerOnly } = require('../middleware/roleMiddleware');

router.use(protect, ownerOnly);

router.get('/property/:propertyId', getUnitsByProperty);
router.post('/',      createUnit);
router.put('/:id',    updateUnit);
router.delete('/:id', deleteUnit);

module.exports = router;