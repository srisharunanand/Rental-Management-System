# Payment & Email Services Documentation

## Payment Service

### Overview
The payment service generates UPI payment strings and QR codes for rent collection. **It does NOT process real bank transactions** - it only creates payment requests with UPI/QR codes that users can scan and pay manually.

### Key Features
- **UPI String Generation**: Creates standard UPI payment strings (upi://pay?...)
- **QR Code Generation**: Generates scannable QR codes from UPI strings
- **Payment Request Creation**: Bundles UPI + QR code with metadata
- **Bulk Processing**: Generate multiple payment requests at once
- **Manual Confirmation**: Confirm when payment is received

### Usage Examples

#### Generate a Single Payment Request
```javascript
const { createPaymentRequest } = require('./paymentService');

const paymentRequest = await createPaymentRequest({
  upiId: 'owner@okhdfcbank',
  payeeName: 'Arjun Kumar',
  amount: 15000,
  description: 'Rent Payment - Feb 2026',
  transactionRef: 'RENT-FEB-2026-001',
  invoiceId: 'INV-001',
  tenantId: 'TENANT-001',
});

// Returns object with:
// - id: Unique payment request ID
// - upiString: "upi://pay?pa=owner@okhdfcbank&pn=Arjun%20Kumar&..."
// - qrCode: "data:image/png;base64,iVBORw0KGgo..." (Base64 encoded)
// - status: "pending"
// - expiresAt: Timestamp (24 hours from now)
```

#### Generate Bulk Payment Requests
```javascript
const payments = [
  { upiId: 'owner@bank', payeeName: 'Owner', amount: 15000, description: 'Rent-Unit1', ... },
  { upiId: 'owner@bank', payeeName: 'Owner', amount: 15000, description: 'Rent-Unit2', ... },
];

const requests = await generateBulkPaymentRequests(payments);
```

#### Confirm Payment Received
```javascript
const confirmation = await confirmPaymentReceived({
  paymentId: 'PAY-123',
  transactionRef: 'RENT-FEB-2026-001',
  amount: 15000,
  paidVia: 'upi',
  paidAt: new Date(),
  tenantUpiId: 'tenant@bank',
  notes: 'Payment received via Google Pay',
});
```

### Integration with Payment Routes
```javascript
// In your payment controller
const { createPaymentRequest } = require('../services/paymentService');

router.post('/payments/generate-qr', async (req, res) => {
  const { invoiceId, tenantId, amount } = req.body;
  
  const paymentRequest = await createPaymentRequest({
    upiId: process.env.PAYMENT_UPI_ID,
    payeeName: 'Property Manager',
    amount,
    description: `Invoice Payment - ${invoiceId}`,
    invoiceId,
    tenantId,
  });
  
  res.json({ success: true, data: paymentRequest });
});
```

---

## Email Service

### Overview
Handles all transactional emails: rent reminders, invoices, lease alerts, maintenance updates, and welcome emails.

### Setup Requirements

#### 1. Install Nodemailer
```bash
npm install nodemailer
```

#### 2. Gmail Configuration (Recommended)
1. Enable 2-Factor Authentication on your Gmail account
2. Visit [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Generate an "App Password" for Mail (Windows Computer)
4. Copy the 16-character password

#### 3. Set Environment Variables
```env
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=noreply@rentmanager.in
```

### Email Types & Usage

#### 1. Rent Payment Reminder
Sent to tenants 3 days before rent is due.
```javascript
const { sendRentReminderEmail } = require('./emailService');

await sendRentReminderEmail({
  tenantEmail: 'tenant@email.com',
  tenantName: 'John Doe',
  propertyName: 'Greenview Apartments',
  unitNumber: '4B',
  amount: 15000,
  dueDate: '2026-03-31',
  upiId: 'owner@okhdfcbank',
});
```

#### 2. Invoice Notification
Sent when a new invoice is created.
```javascript
await sendInvoiceNotificationEmail({
  tenantEmail: 'tenant@email.com',
  tenantName: 'John Doe',
  invoiceNumber: 'INV-2026-001',
  amount: 15000,
  invoiceDate: '2026-03-01',
  dueDate: '2026-03-15',
  description: 'Monthly Rent - February 2026',
});
```

#### 3. Lease Expiry Alert
Sent 30 days before lease expiration.
```javascript
await sendLeaseExpiryAlertEmail({
  tenantEmail: 'tenant@email.com',
  tenantName: 'John Doe',
  propertyName: 'Greenview Apartments',
  unitNumber: '4B',
  expiryDate: '2026-06-30',
  daysRemaining: 30,
});
```

#### 4. Maintenance Update
Sent when maintenance request status changes.
```javascript
await sendMaintenanceUpdateEmail({
  email: 'tenant@email.com',
  name: 'John Doe',
  requestId: 'MNT-001',
  status: 'in_progress',
  description: 'Leaking tap in kitchen',
  updateMessage: 'Our plumber will visit tomorrow at 2 PM. Please be available.',
});
```

#### 5. Welcome Email
Sent when a new tenant is added to a property.
```javascript
await sendWelcomeEmail({
  tenantEmail: 'tenant@email.com',
  tenantName: 'John Doe',
  propertyName: 'Greenview Apartments',
  unitNumber: '4B',
  leaseStartDate: '2026-03-01',
  ownerName: 'Arjun Kumar',
  ownerPhone: '+91 98400 00001',
});
```

#### 6. Test Connection
Verify email service is configured correctly.
```javascript
const result = await testEmailConnection();
if (result.success) {
  console.log('Email service ready!');
}
```

### Integration with Controllers

#### Example: Payment Controller
```javascript
const { sendRentReminderEmail } = require('../services/emailService');
const { paymentAPI } = require('../services/paymentService');

router.post('/payments/send-reminder', async (req, res) => {
  const { invoiceId } = req.body;
  
  // Get invoice data from DB
  const invoice = await getInvoiceFromDB(invoiceId);
  const tenant = await getTenantFromDB(invoice.tenant_id);
  
  // Send reminder email
  const emailResult = await sendRentReminderEmail({
    tenantEmail: tenant.email,
    tenantName: tenant.name,
    propertyName: invoice.property.name,
    unitNumber: invoice.unit.unit_number,
    amount: invoice.amount,
    dueDate: invoice.due_date,
    upiId: process.env.PAYMENT_UPI_ID,
  });
  
  if (emailResult.success) {
    res.json({ success: true, message: 'Reminder sent', messageId: emailResult.messageId });
  } else {
    res.status(500).json({ success: false, error: emailResult.error });
  }
});
```

---

## Testing the Services

### Test Payment Service
```bash
# In Node REPL or test file
const { createPaymentRequest, getPaymentMethods } = require('./services/paymentService');

// Generate test payment
const payment = await createPaymentRequest({
  upiId: 'test@bank',
  payeeName: 'Test Owner',
  amount: 1000,
  description: 'Test Payment',
});

console.log(payment.qrCode); // QR code as data URL
console.log(payment.upiString); // UPI string
```

### Test Email Service
```bash
# In Node REPL or test file
const { testEmailConnection, sendRentReminderEmail } = require('./services/emailService');

// Test connection
const connTest = await testEmailConnection();
console.log(connTest); // { success: true/false, ... }

// Send test email
const result = await sendRentReminderEmail({
  tenantEmail: 'your-test-email@gmail.com',
  tenantName: 'Test Tenant',
  propertyName: 'Test Property',
  unitNumber: '1A',
  amount: 15000,
  dueDate: '2026-03-31',
  upiId: 'owner@bank',
});
```

---

## Important Notes

### Payment Service
- ✅ Generates UPI strings and QR codes
- ✅ Creates payment metadata/tracking
- ❌ Does NOT process real payments
- ❌ Does NOT charge credit cards
- ❌ Does NOT access bank accounts
- Manual verification required when tenant pays

### Email Service
- Requires valid Gmail account with 2FA + App Password
- Alternative: Use your own SMTP server by configuring environment variables
- All emails are HTML-formatted with professional styling
- Emails are logged (success/failure) for audit trail
- Consider rate limiting in production (600 emails/minute for Gmail)

---

## Next Steps

1. **Install Dependencies**
   ```bash
   cd backend
   npm install nodemailer qrcode express-validator
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Add your Gmail credentials (or other SMTP)
   - Add payment UPI ID

3. **Test the Connection**
   ```javascript
   const { testEmailConnection } = require('./services/emailService');
   await testEmailConnection();
   ```

4. **Integrate with Routes**
   - Add payment QR generation endpoints
   - Add email triggering in invoice/lease/maintenance controllers
   - Schedule automatic reminders (cron jobs)

5. **Add to Controllers**
   - Payment controller: Generate QR codes on invoice creation
   - Invoice controller: Send notification email
   - Lease controller: Send alerts before expiry
   - Maintenance controller: Send status updates
