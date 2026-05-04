const express = require('express');
const router  = express.Router();
const { getInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice } = require('../controllers/invoiceController');
const { protect }   = require('../middleware/authMiddleware');

router.use(protect);

router.get('/',       getInvoices);
router.get('/:id',    getInvoice);
router.post('/',      createInvoice);
router.put('/:id',    updateInvoice);
router.delete('/:id', deleteInvoice);

module.exports = router;