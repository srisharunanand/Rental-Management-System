const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// ==================== AUTH VALIDATORS ====================
const authValidators = {
  register: [
    body('name')
      .trim()
      .not().isEmpty().withMessage('Name is required')
      .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email')
      .trim()
      .isEmail().withMessage('Valid email is required')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
      .matches(/[A-Z]/).withMessage('Password must contain uppercase letter')
      .matches(/[a-z]/).withMessage('Password must contain lowercase letter')
      .matches(/[0-9]/).withMessage('Password must contain number'),
    body('role')
      .optional()
      .isIn(['owner', 'tenant']).withMessage('Role must be owner or tenant'),
    body('phone')
      .optional()
      .trim()
      .matches(/^\+?[\d\s\-()]+$/).withMessage('Invalid phone number format')
  ],
  
  login: [
    body('email')
      .trim()
      .isEmail().withMessage('Valid email is required')
      .normalizeEmail(),
    body('password')
      .not().isEmpty().withMessage('Password is required')
  ],

  changePassword: [
    body('oldPassword')
      .not().isEmpty().withMessage('Old password is required'),
    body('newPassword')
      .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
      .matches(/[A-Z]/).withMessage('Password must contain uppercase letter')
      .matches(/[a-z]/).withMessage('Password must contain lowercase letter')
      .matches(/[0-9]/).withMessage('Password must contain number')
      .custom((value, { req }) => {
        if (value === req.body.oldPassword) {
          throw new Error('New password must be different from old password');
        }
        return true;
      })
  ]
};

// ==================== PROPERTY VALIDATORS ====================
const propertyValidators = {
  create: [
    body('name')
      .trim()
      .not().isEmpty().withMessage('Property name is required')
      .isLength({ max: 255 }).withMessage('Name must not exceed 255 characters'),
    body('address')
      .trim()
      .not().isEmpty().withMessage('Address is required')
      .isLength({ max: 500 }).withMessage('Address must not exceed 500 characters'),
    body('city')
      .trim()
      .optional()
      .isLength({ max: 100 }).withMessage('City must not exceed 100 characters'),
    body('state')
      .trim()
      .optional()
      .isLength({ max: 100 }).withMessage('State must not exceed 100 characters'),
    body('zip_code')
      .trim()
      .optional()
      .matches(/^[\d\-]+$/).withMessage('Invalid zip code format'),
    body('property_type')
      .optional()
      .isIn(['apartment', 'house', 'condo']).withMessage('Invalid property type'),
    body('construction_year')
      .optional()
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage('Invalid construction year'),
    body('total_area')
      .optional()
      .isFloat({ min: 0 }).withMessage('Total area must be positive number'),
    body('total_units')
      .optional()
      .isInt({ min: 1 }).withMessage('Total units must be at least 1')
  ],

  update: [
    param('id')
      .isInt({ min: 1 }).withMessage('Invalid property ID'),
    body('name')
      .optional()
      .trim()
      .isLength({ max: 255 }).withMessage('Name must not exceed 255 characters'),
    body('address')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Address must not exceed 500 characters'),
    body('property_type')
      .optional()
      .isIn(['apartment', 'house', 'condo']).withMessage('Invalid property type')
  ]
};

// ==================== UNIT VALIDATORS ====================
const unitValidators = {
  create: [
    body('property_id')
      .isInt({ min: 1 }).withMessage('Valid property ID is required'),
    body('unit_number')
      .trim()
      .not().isEmpty().withMessage('Unit number is required')
      .isLength({ max: 50 }).withMessage('Unit number must not exceed 50 characters'),
    body('bedroom_count')
      .isInt({ min: 0 }).withMessage('Bedroom count must be 0 or more'),
    body('bathroom_count')
      .isInt({ min: 0 }).withMessage('Bathroom count must be 0 or more'),
    body('area')
      .optional()
      .isFloat({ min: 0 }).withMessage('Area must be positive number'),
    body('rent_amount')
      .isFloat({ min: 0 }).withMessage('Rent amount must be positive number'),
    body('floor')
      .optional()
      .isInt({ min: 0 }).withMessage('Floor must be 0 or more')
  ],

  update: [
    param('id')
      .isInt({ min: 1 }).withMessage('Invalid unit ID'),
    body('rent_amount')
      .optional()
      .isFloat({ min: 0 }).withMessage('Rent amount must be positive number'),
    body('status')
      .optional()
      .isIn(['available', 'occupied', 'maintenance']).withMessage('Invalid status')
  ]
};

// ==================== LEASE VALIDATORS ====================
const leaseValidators = {
  create: [
    body('unit_id')
      .isInt({ min: 1 }).withMessage('Valid unit ID is required'),
    body('tenant_id')
      .isInt({ min: 1 }).withMessage('Valid tenant ID is required'),
    body('start_date')
      .isISO8601().withMessage('Valid start date is required'),
    body('end_date')
      .isISO8601().withMessage('Valid end date is required')
      .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.start_date)) {
          throw new Error('End date must be after start date');
        }
        return true;
      }),
    body('monthly_rent')
      .isFloat({ min: 0 }).withMessage('Monthly rent must be positive number'),
    body('security_deposit')
      .optional()
      .isFloat({ min: 0 }).withMessage('Security deposit must be positive number')
  ],

  update: [
    param('id')
      .isInt({ min: 1 }).withMessage('Invalid lease ID'),
    body('status')
      .optional()
      .isIn(['active', 'expired', 'terminated']).withMessage('Invalid lease status')
  ]
};

// ==================== INVOICE VALIDATORS ====================
const invoiceValidators = {
  create: [
    body('lease_id')
      .isInt({ min: 1 }).withMessage('Valid lease ID is required'),
    body('unit_id')
      .isInt({ min: 1 }).withMessage('Valid unit ID is required'),
    body('tenant_id')
      .isInt({ min: 1 }).withMessage('Valid tenant ID is required'),
    body('amount')
      .isFloat({ min: 0 }).withMessage('Amount must be positive number'),
    body('due_date')
      .isISO8601().withMessage('Valid due date is required'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters')
  ],

  update: [
    param('id')
      .isInt({ min: 1 }).withMessage('Invalid invoice ID'),
    body('status')
      .optional()
      .isIn(['pending', 'paid', 'overdue', 'cancelled']).withMessage('Invalid status')
  ]
};

// ==================== PAYMENT VALIDATORS ====================
const paymentValidators = {
  create: [
    body('invoice_id')
      .isInt({ min: 1 }).withMessage('Valid invoice ID is required'),
    body('lease_id')
      .isInt({ min: 1 }).withMessage('Valid lease ID is required'),
    body('amount')
      .isFloat({ min: 0 }).withMessage('Amount must be positive number'),
    body('payment_method')
      .isIn(['credit_card', 'debit_card', 'bank_transfer', 'check', 'cash'])
      .withMessage('Invalid payment method'),
    body('payment_date')
      .isISO8601().withMessage('Valid payment date is required'),
    body('transaction_id')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Transaction ID must not exceed 100 characters')
  ]
};

// ==================== MAINTENANCE REQUEST VALIDATORS ====================
const maintenanceValidators = {
  create: [
    body('unit_id')
      .isInt({ min: 1 }).withMessage('Valid unit ID is required'),
    body('title')
      .trim()
      .not().isEmpty().withMessage('Title is required')
      .isLength({ max: 255 }).withMessage('Title must not exceed 255 characters'),
    body('description')
      .trim()
      .not().isEmpty().withMessage('Description is required')
      .isLength({ max: 2000 }).withMessage('Description must not exceed 2000 characters'),
    body('category')
      .optional()
      .isIn(['plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'other'])
      .withMessage('Invalid category'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority')
  ],

  update: [
    param('id')
      .isInt({ min: 1 }).withMessage('Invalid maintenance request ID'),
    body('status')
      .optional()
      .isIn(['open', 'assigned', 'in_progress', 'completed', 'cancelled'])
      .withMessage('Invalid status'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority')
  ]
};

// ==================== MESSAGE VALIDATORS ====================
const messageValidators = {
  create: [
    body('conversation_id')
      .isInt({ min: 1 }).withMessage('Valid conversation ID is required'),
    body('receiver_id')
      .isInt({ min: 1 }).withMessage('Valid receiver ID is required'),
    body('content')
      .trim()
      .not().isEmpty().withMessage('Message content is required')
      .isLength({ max: 5000 }).withMessage('Message must not exceed 5000 characters')
  ],

  startConversation: [
    body('user_id')
      .isInt({ min: 1 }).withMessage('Valid user ID is required')
  ]
};

// ==================== NOTIFICATION VALIDATORS ====================
const notificationValidators = {
  create: [
    body('user_id')
      .isInt({ min: 1 }).withMessage('Valid user ID is required'),
    body('title')
      .trim()
      .not().isEmpty().withMessage('Title is required')
      .isLength({ max: 255 }).withMessage('Title must not exceed 255 characters'),
    body('type')
      .optional()
      .isIn(['payment_due', 'payment_received', 'maintenance_request', 'lease_expiring', 'message', 'invoice', 'other'])
      .withMessage('Invalid notification type')
  ]
};

// ==================== COMMON PARAM VALIDATORS ====================
const paramValidators = {
  id: [
    param('id')
      .isInt({ min: 1 }).withMessage('Invalid ID')
  ],

  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be at least 1'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ]
};

// Export all validators
module.exports = {
  handleValidationErrors,
  authValidators,
  propertyValidators,
  unitValidators,
  leaseValidators,
  invoiceValidators,
  paymentValidators,
  maintenanceValidators,
  messageValidators,
  notificationValidators,
  paramValidators
};
