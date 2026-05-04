// Application Constants

// ==================== USER ROLES ====================
const USER_ROLES = {
  OWNER: 'owner',
  TENANT: 'tenant',
  ADMIN: 'admin'
};

// ==================== HTTP STATUS CODES ====================
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// ==================== ERROR MESSAGES ====================
const ERROR_MESSAGES = {
  // Auth errors
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User with this email already exists',
  PASSWORD_MISMATCH: 'Old password does not match',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_TOKEN: 'Invalid or missing token',
  UNAUTHORIZED: 'You do not have permission to access this resource',
  
  // Resource errors
  RESOURCE_NOT_FOUND: 'Resource not found',
  PROPERTY_NOT_FOUND: 'Property not found',
  UNIT_NOT_FOUND: 'Unit not found',
  LEASE_NOT_FOUND: 'Lease not found',
  TENANT_NOT_FOUND: 'Tenant not found',
  INVOICE_NOT_FOUND: 'Invoice not found',
  PAYMENT_NOT_FOUND: 'Payment not found',
  MESSAGE_NOT_FOUND: 'Message not found',
  CONVERSATION_NOT_FOUND: 'Conversation not found',
  
  // Business logic errors
  UNIT_ALREADY_OCCUPIED: 'Unit is already occupied',
  UNIT_NOT_AVAILABLE: 'Unit is not available',
  LEASE_ALREADY_EXISTS: 'Active lease already exists for this unit',
  INVALID_LEASE_DATES: 'Lease end date must be after start date',
  LEASE_NOT_ACTIVE: 'Lease is not active',
  PAYMENT_AMOUNT_MISMATCH: 'Payment amount does not match invoice amount',
  INVOICE_ALREADY_PAID: 'Invoice is already paid',
  
  // Validation errors
  VALIDATION_ERROR: 'Validation error',
  INVALID_INPUT: 'Invalid input provided',
  MISSING_REQUIRED_FIELD: 'Missing required field',
  
  // Server errors
  INTERNAL_SERVER_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database error occurred',
  EMAIL_SEND_ERROR: 'Failed to send email',
  
  // Generic
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.'
};

// ==================== SUCCESS MESSAGES ====================
const SUCCESS_MESSAGES = {
  // Auth
  REGISTER_SUCCESS: 'Registration successful',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PASSWORD_CHANGED: 'Password changed successfully',
  
  // CRUD operations
  CREATED_SUCCESS: 'Resource created successfully',
  UPDATED_SUCCESS: 'Resource updated successfully',
  DELETED_SUCCESS: 'Resource deleted successfully',
  FETCHED_SUCCESS: 'Resource fetched successfully',
  
  // Specific operations
  TENANT_ADDED: 'Tenant added successfully',
  LEASE_CREATED: 'Lease created successfully',
  PAYMENT_RECORDED: 'Payment recorded successfully',
  INVOICE_CREATED: 'Invoice created successfully',
  MAINTENANCE_REQUEST_CREATED: 'Maintenance request created successfully',
  NOTIFICATION_MARKED_READ: 'Notification marked as read'
};

// ==================== PROPERTY TYPES ====================
const PROPERTY_TYPES = {
  APARTMENT: 'apartment',
  HOUSE: 'house',
  CONDO: 'condo'
};

// ==================== UNIT STATUS ====================
const UNIT_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance'
};

// ==================== LEASE STATUS ====================
const LEASE_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  TERMINATED: 'terminated'
};

// ==================== INVOICE STATUS ====================
const INVOICE_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
};

// ==================== PAYMENT STATUS ====================
const PAYMENT_STATUS = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  FAILED: 'failed'
};

// ==================== PAYMENT METHODS ====================
const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  CHECK: 'check',
  CASH: 'cash'
};

// ==================== MAINTENANCE PRIORITY ====================
const MAINTENANCE_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// ==================== MAINTENANCE STATUS ====================
const MAINTENANCE_STATUS = {
  OPEN: 'open',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// ==================== MAINTENANCE CATEGORIES ====================
const MAINTENANCE_CATEGORIES = {
  PLUMBING: 'plumbing',
  ELECTRICAL: 'electrical',
  HVAC: 'hvac',
  APPLIANCE: 'appliance',
  STRUCTURAL: 'structural',
  OTHER: 'other'
};

// ==================== NOTIFICATION TYPES ====================
const NOTIFICATION_TYPES = {
  PAYMENT_DUE: 'payment_due',
  PAYMENT_RECEIVED: 'payment_received',
  MAINTENANCE_REQUEST: 'maintenance_request',
  LEASE_EXPIRING: 'lease_expiring',
  MESSAGE: 'message',
  INVOICE: 'invoice',
  OTHER: 'other'
};

// ==================== DATE FORMATS ====================
const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DB: 'YYYY-MM-DD',
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ'
};

// ==================== PAGINATION ====================
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// ==================== JWT ====================
const JWT_CONFIG = {
  EXPIRY: process.env.JWT_EXPIRY || '7d',
  ALGORITHM: 'HS256'
};

// ==================== EMAIL CONFIG ====================
const EMAIL_CONFIG = {
  FROM: process.env.EMAIL_FROM || 'noreply@rentalmanagementsystem.com',
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: process.env.SMTP_PORT || 587,
  MAX_RETRIES: 3,
  TIMEOUT: 5000
};

// ==================== PAYMENT GATEWAY ====================
const PAYMENT_CONFIG = {
  STRIPE_KEY: process.env.STRIPE_SECRET_KEY,
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  PAYPAL_SECRET: process.env.PAYPAL_SECRET
};

// ==================== FILE UPLOAD ====================
const FILE_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_EXTENSIONS: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
  UPLOAD_DIR: './uploads'
};

// ==================== VALIDATION RULES ====================
const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 255,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^\+?[\d\s\-()]+$/,
  ZIP_CODE_PATTERN: /^[\d\-]+$/
};

// ==================== CACHE CONFIG ====================
const CACHE_CONFIG = {
  TTL: process.env.CACHE_TTL || 3600, // 1 hour
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379
};

// ==================== API LIMITS ====================
const API_LIMITS = {
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  REQUEST_TIMEOUT: 30000 // 30 seconds
};

// ==================== NOTIFICATION SETTINGS ====================
const NOTIFICATION_SETTINGS = {
  PAYMENT_DUE_DAYS_BEFORE: 3, // Send notification 3 days before due date
  LEASE_EXPIRY_DAYS_BEFORE: 30, // Send notification 30 days before lease expiry
  REMINDER_CHECK_TIME: '09:00' // Check for reminders at 9 AM
};

// Export all constants
module.exports = {
  USER_ROLES,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PROPERTY_TYPES,
  UNIT_STATUS,
  LEASE_STATUS,
  INVOICE_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  MAINTENANCE_PRIORITY,
  MAINTENANCE_STATUS,
  MAINTENANCE_CATEGORIES,
  NOTIFICATION_TYPES,
  DATE_FORMATS,
  PAGINATION,
  JWT_CONFIG,
  EMAIL_CONFIG,
  PAYMENT_CONFIG,
  FILE_CONFIG,
  VALIDATION_RULES,
  CACHE_CONFIG,
  API_LIMITS,
  NOTIFICATION_SETTINGS
};
