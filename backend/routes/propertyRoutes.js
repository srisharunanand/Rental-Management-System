const express = require('express');
const router  = express.Router();
const { getProperties, getProperty, createProperty, updateProperty, deleteProperty } = require('../controllers/propertyController');
const { protect }   = require('../middleware/authMiddleware');
const { ownerOnly } = require('../middleware/roleMiddleware');

router.use(protect, ownerOnly);

router.get('/',       getProperties);
router.get('/:id',    getProperty);
router.post('/',      createProperty);
router.put('/:id',    updateProperty);
router.delete('/:id', deleteProperty);

module.exports = router;