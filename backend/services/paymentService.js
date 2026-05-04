/**
 * Payment Service
 * Generates UPI payment strings and QR codes for payment collection
 * Does NOT process real bank transactions
 */

const crypto = require('crypto');
const QRCode = require('qrcode');

/**
 * Generate UPI payment string
 * @param {Object} paymentData - Payment information
 * @param {string} paymentData.upiId - Receiver UPI ID (e.g., "owner@okhdfcbank")
 * @param {string} paymentData.payeeName - Name of payee
 * @param {number} paymentData.amount - Payment amount in rupees
 * @param {string} paymentData.description - Payment description (rent/invoice/etc)
 * @param {string} paymentData.transactionRef - Unique transaction reference ID
 * @returns {string} UPI payment string
 */
const generateUPIString = (paymentData) => {
  const { upiId, payeeName, amount, description, transactionRef } = paymentData;

  if (!upiId || !payeeName || !amount || !description) {
    throw new Error('Missing required payment data: upiId, payeeName, amount, description');
  }

  // Standard UPI format: upi://pay?pa=UPI_ID&pn=NAME&tn=DESCRIPTION&am=AMOUNT&tr=REFERENCE
  const upiString = 
    `upi://pay?pa=${encodeURIComponent(upiId)}` +
    `&pn=${encodeURIComponent(payeeName)}` +
    `&tn=${encodeURIComponent(description)}` +
    `&am=${amount}` +
    `&tr=${encodeURIComponent(transactionRef)}`;

  return upiString;
};

/**
 * Generate QR code for UPI payment
 * @param {string} upiString - UPI payment string
 * @returns {Promise<string>} Base64 encoded QR code image
 */
const generateQRCode = async (upiString) => {
  try {
    // Generate QR code as data URL (base64)
    const qrCodeDataUrl = await QRCode.toDataURL(upiString, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300,
    });
    return qrCodeDataUrl;
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
};

/**
 * Create payment request with UPI and QR code
 * @param {Object} paymentData - Payment information
 * @returns {Promise<Object>} Payment request object with UPI and QR code
 */
const createPaymentRequest = async (paymentData) => {
  try {
    const { upiId, payeeName, amount, description, transactionRef, invoiceId, tenantId } = paymentData;

    // Generate UPI string
    const upiString = generateUPIString({
      upiId,
      payeeName,
      amount,
      description,
      transactionRef: transactionRef || crypto.randomBytes(8).toString('hex').toUpperCase(),
    });

    // Generate QR code
    const qrCode = await generateQRCode(upiString);

    // Create payment request object
    const paymentRequest = {
      id: crypto.randomBytes(8).toString('hex'),
      transactionRef: transactionRef || crypto.randomBytes(8).toString('hex').toUpperCase(),
      invoiceId,
      tenantId,
      amount,
      description,
      payeeName,
      upiId,
      upiString,
      qrCode, // Base64 encoded QR code image
      status: 'pending', // pending, paid, cancelled
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hour expiry
      paidAt: null,
      paidVia: null, // 'upi', 'manual', 'check', etc
      notes: '',
    };

    return paymentRequest;
  } catch (error) {
    throw new Error(`Failed to create payment request: ${error.message}`);
  }
};

/**
 * Generate multiple payment QR codes (for bulk invoices)
 * @param {Array} payments - Array of payment objects
 * @returns {Promise<Array>} Array of payment requests with QR codes
 */
const generateBulkPaymentRequests = async (payments) => {
  try {
    const paymentRequests = await Promise.all(
      payments.map(payment => createPaymentRequest(payment))
    );
    return paymentRequests;
  } catch (error) {
    throw new Error(`Failed to generate bulk payment requests: ${error.message}`);
  }
};

/**
 * Simulate payment received (manual confirmation - NOT real processing)
 * Used when tenant pays via UPI and manually confirms
 * @param {Object} paymentData - Payment information
 * @returns {Promise<Object>} Payment confirmation
 */
const confirmPaymentReceived = async (paymentData) => {
  try {
    const {
      paymentId,
      transactionRef,
      amount,
      paidVia = 'upi',
      paidAt = new Date(),
      tenantUpiId,
      notes = '',
    } = paymentData;

    // In a real system, this would verify with bank
    // For now, just create a record
    const paymentConfirmation = {
      id: paymentId || crypto.randomBytes(8).toString('hex'),
      transactionRef,
      amount,
      status: 'paid',
      paidVia,
      paidAt,
      tenantUpiId,
      notes,
      confirmedAt: new Date(),
      confirmationCode: `CONF-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    };

    return paymentConfirmation;
  } catch (error) {
    throw new Error(`Failed to confirm payment: ${error.message}`);
  }
};

/**
 * Get payment methods supported by the system
 * @returns {Object} Available payment methods
 */
const getPaymentMethods = () => {
  return {
    supported: [
      {
        method: 'upi',
        name: 'UPI (Google Pay, PhonePe, Paytm)',
        icon: '📱',
        description: 'Scan QR code or use UPI app',
        isInstant: true,
      },
      {
        method: 'manual',
        name: 'Manual Confirmation',
        icon: '✅',
        description: 'Pay via bank transfer and confirm',
        isInstant: false,
      },
      {
        method: 'check',
        name: 'Cheque',
        icon: '📄',
        description: 'Pay by cheque (physical)',
        isInstant: false,
      },
      {
        method: 'cash',
        name: 'Cash',
        icon: '💵',
        description: 'Direct cash payment',
        isInstant: true,
      },
    ],
  };
};

/**
 * Format payment for display
 * @param {Object} payment - Payment object
 * @returns {Object} Formatted payment
 */
const formatPaymentForDisplay = (payment) => {
  return {
    id: payment.id,
    transactionRef: payment.transactionRef,
    amount: `₹${payment.amount.toLocaleString()}`,
    status: payment.status,
    description: payment.description,
    createdAt: new Date(payment.createdAt).toLocaleDateString('en-IN'),
    expiresAt: new Date(payment.expiresAt).toLocaleDateString('en-IN'),
    payeeName: payment.payeeName,
    hasPaid: payment.status === 'paid',
  };
};

module.exports = {
  generateUPIString,
  generateQRCode,
  createPaymentRequest,
  generateBulkPaymentRequests,
  confirmPaymentReceived,
  getPaymentMethods,
  formatPaymentForDisplay,
};
