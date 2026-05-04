const express = require('express');
const router  = express.Router();
const { getPayments, createPayment, updatePayment, getPaymentStats } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/',        getPayments);
router.get('/stats',   getPaymentStats);
router.post('/',       createPayment);
router.put('/:id',     updatePayment);

module.exports = router;