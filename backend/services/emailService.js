/**
 * Email Service
 * Handles all transactional emails for the rental management system
 */

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Email configuration from environment or defaults
const emailConfig = {
  service: process.env.EMAIL_SERVICE || 'gmail',
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // false for 587, true for 465
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password',
  },
  from: process.env.EMAIL_FROM || 'noreply@rentmanager.in',
};

// Initialize transporter
let transporter = null;

const initializeTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport(emailConfig);
  }
  return transporter;
};

/**
 * Send rent payment reminder
 * @param {Object} data - Email data
 * @param {string} data.tenantEmail - Tenant email address
 * @param {string} data.tenantName - Tenant name
 * @param {string} data.propertyName - Property name
 * @param {string} data.unitNumber - Unit number
 * @param {number} data.amount - Rent amount in rupees
 * @param {string} data.dueDate - Due date (YYYY-MM-DD)
 * @param {string} data.upiId - UPI ID for payment
 * @returns {Promise<Object>} Email send result
 */
const sendRentReminderEmail = async (data) => {
  try {
    const {
      tenantEmail,
      tenantName,
      propertyName,
      unitNumber,
      amount,
      dueDate,
      upiId,
    } = data;

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
        <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 24px; font-weight: bold; color: #06b6d4;">🏠 RentManager</div>
            <div style="color: #666; font-size: 12px; margin-top: 5px;">Property Management System</div>
          </div>

          <h2 style="color: #333; margin-bottom: 20px;">Rent Payment Reminder</h2>
          
          <p style="color: #555; line-height: 1.6;">
            Hi <strong>${tenantName}</strong>,
          </p>

          <p style="color: #555; line-height: 1.6;">
            This is a friendly reminder that your rent payment is due soon.
          </p>

          <div style="background: #f9f9f9; border-left: 4px solid #06b6d4; padding: 15px; margin: 20px 0;">
            <table style="width: 100%; color: #333;">
              <tr>
                <td style="padding: 8px 0;"><strong>Property:</strong></td>
                <td style="text-align: right;">${propertyName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Unit:</strong></td>
                <td style="text-align: right;">${unitNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Amount Due:</strong></td>
                <td style="text-align: right; font-size: 18px; color: #f43f5e;"><strong>₹${amount.toLocaleString()}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Due Date:</strong></td>
                <td style="text-align: right;">${new Date(dueDate).toLocaleDateString('en-IN')}</td>
              </tr>
            </table>
          </div>

          <p style="color: #555; line-height: 1.6; margin: 20px 0;">
            <strong>📱 Payment Method:</strong><br/>
            Pay via UPI: <strong>${upiId}</strong>
          </p>

          <p style="color: #888; font-size: 12px; line-height: 1.6;">
            If you have already made the payment, please ignore this reminder. If you have any questions, please contact your property manager.
          </p>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              © 2026 RentManager. All rights reserved.<br/>
              This is an automated email. Please do not reply.
            </p>
          </div>
        </div>
      </div>
    `;

    const mail = await initializeTransporter().sendMail({
      from: emailConfig.from,
      to: tenantEmail,
      subject: `Rent Payment Reminder - ${propertyName} ${unitNumber} - ₹${amount}`,
      html: htmlContent,
    });

    return {
      success: true,
      messageId: mail.messageId,
      timestamp: new Date(),
      recipient: tenantEmail,
    };
  } catch (error) {
    console.error('Error sending rent reminder email:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date(),
    };
  }
};

/**
 * Send invoice notification
 * @param {Object} data - Email data
 * @param {string} data.tenantEmail - Tenant email address
 * @param {string} data.tenantName - Tenant name
 * @param {string} data.invoiceNumber - Invoice number
 * @param {number} data.amount - Invoice amount
 * @param {string} data.invoiceDate - Invoice date (YYYY-MM-DD)
 * @param {string} data.dueDate - Payment due date (YYYY-MM-DD)
 * @param {string} data.description - Invoice description
 * @returns {Promise<Object>} Email send result
 */
const sendInvoiceNotificationEmail = async (data) => {
  try {
    const {
      tenantEmail,
      tenantName,
      invoiceNumber,
      amount,
      invoiceDate,
      dueDate,
      description,
    } = data;

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
        <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 24px; font-weight: bold; color: #06b6d4;">🧾 RentManager</div>
          </div>

          <h2 style="color: #333; margin-bottom: 20px;">Invoice Notification</h2>

          <p style="color: #555; line-height: 1.6;">
            Hi <strong>${tenantName}</strong>,
          </p>

          <p style="color: #555; line-height: 1.6;">
            A new invoice has been generated for you.
          </p>

          <div style="background: #f9f9f9; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0;">
            <table style="width: 100%; color: #333;">
              <tr>
                <td style="padding: 8px 0;"><strong>Invoice #:</strong></td>
                <td style="text-align: right;">${invoiceNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Description:</strong></td>
                <td style="text-align: right;">${description}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Amount:</strong></td>
                <td style="text-align: right; font-size: 18px; color: #22c55e;"><strong>₹${amount.toLocaleString()}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Invoice Date:</strong></td>
                <td style="text-align: right;">${new Date(invoiceDate).toLocaleDateString('en-IN')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Due Date:</strong></td>
                <td style="text-align: right;">${new Date(dueDate).toLocaleDateString('en-IN')}</td>
              </tr>
            </table>
          </div>

          <p style="color: #888; font-size: 12px; line-height: 1.6;">
            Please make the payment by the due date. For questions, contact your property manager.
          </p>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              © 2026 RentManager. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `;

    const mail = await initializeTransporter().sendMail({
      from: emailConfig.from,
      to: tenantEmail,
      subject: `Invoice ${invoiceNumber} - ₹${amount}`,
      html: htmlContent,
    });

    return {
      success: true,
      messageId: mail.messageId,
      timestamp: new Date(),
      recipient: tenantEmail,
    };
  } catch (error) {
    console.error('Error sending invoice notification email:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date(),
    };
  }
};

/**
 * Send lease expiry alert
 * @param {Object} data - Email data
 * @param {string} data.tenantEmail - Tenant email address
 * @param {string} data.tenantName - Tenant name
 * @param {string} data.propertyName - Property name
 * @param {string} data.unitNumber - Unit number
 * @param {string} data.expiryDate - Lease expiry date (YYYY-MM-DD)
 * @param {number} data.daysRemaining - Days until expiry
 * @returns {Promise<Object>} Email send result
 */
const sendLeaseExpiryAlertEmail = async (data) => {
  try {
    const {
      tenantEmail,
      tenantName,
      propertyName,
      unitNumber,
      expiryDate,
      daysRemaining,
    } = data;

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
        <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 24px; font-weight: bold; color: #06b6d4;">📋 RentManager</div>
          </div>

          <h2 style="color: #333; margin-bottom: 20px;">Lease Expiry Alert</h2>

          <p style="color: #555; line-height: 1.6;">
            Hi <strong>${tenantName}</strong>,
          </p>

          <p style="color: #555; line-height: 1.6;">
            Your lease agreement is expiring soon. Please review the details below.
          </p>

          <div style="background: #fff3cd; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
            <table style="width: 100%; color: #333;">
              <tr>
                <td style="padding: 8px 0;"><strong>Property:</strong></td>
                <td style="text-align: right;">${propertyName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Unit:</strong></td>
                <td style="text-align: right;">${unitNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Lease Expiry Date:</strong></td>
                <td style="text-align: right;">${new Date(expiryDate).toLocaleDateString('en-IN')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Days Remaining:</strong></td>
                <td style="text-align: right; font-size: 18px; color: #f59e0b;"><strong>${daysRemaining} days</strong></td>
              </tr>
            </table>
          </div>

          <p style="color: #555; line-height: 1.6;">
            Please contact your property manager to discuss lease renewal options.
          </p>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              © 2026 RentManager. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `;

    const mail = await initializeTransporter().sendMail({
      from: emailConfig.from,
      to: tenantEmail,
      subject: `Lease Expiry Alert - ${propertyName} ${unitNumber}`,
      html: htmlContent,
    });

    return {
      success: true,
      messageId: mail.messageId,
      timestamp: new Date(),
      recipient: tenantEmail,
    };
  } catch (error) {
    console.error('Error sending lease expiry alert email:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date(),
    };
  }
};

/**
 * Send maintenance request update
 * @param {Object} data - Email data
 * @param {string} data.email - Recipient email
 * @param {string} data.name - Recipient name
 * @param {string} data.requestId - Maintenance request ID
 * @param {string} data.status - Request status
 * @param {string} data.description - Issue description
 * @param {string} data.updateMessage - Status update message
 * @returns {Promise<Object>} Email send result
 */
const sendMaintenanceUpdateEmail = async (data) => {
  try {
    const {
      email,
      name,
      requestId,
      status,
      description,
      updateMessage,
    } = data;

    const statusColors = {
      assigned: '#06b6d4',
      in_progress: '#f59e0b',
      completed: '#22c55e',
      cancelled: '#f43f5e',
    };

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
        <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 24px; font-weight: bold; color: #06b6d4;">🔧 RentManager</div>
          </div>

          <h2 style="color: #333; margin-bottom: 20px;">Maintenance Request Update</h2>

          <p style="color: #555; line-height: 1.6;">
            Hi <strong>${name}</strong>,
          </p>

          <p style="color: #555; line-height: 1.6;">
            There's an update on your maintenance request.
          </p>

          <div style="background: #f9f9f9; border-left: 4px solid ${statusColors[status] || '#06b6d4'}; padding: 15px; margin: 20px 0;">
            <table style="width: 100%; color: #333;">
              <tr>
                <td style="padding: 8px 0;"><strong>Request ID:</strong></td>
                <td style="text-align: right;">${requestId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Issue:</strong></td>
                <td style="text-align: right;">${description}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Status:</strong></td>
                <td style="text-align: right; color: ${statusColors[status] || '#06b6d4'}; font-weight: bold;"><strong>${status.toUpperCase()}</strong></td>
              </tr>
            </table>
          </div>

          <p style="color: #555; line-height: 1.6; margin: 15px 0;">
            <strong>Update:</strong><br/>
            ${updateMessage}
          </p>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              © 2026 RentManager. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `;

    const mail = await initializeTransporter().sendMail({
      from: emailConfig.from,
      to: email,
      subject: `Maintenance Request Update - ${requestId}`,
      html: htmlContent,
    });

    return {
      success: true,
      messageId: mail.messageId,
      timestamp: new Date(),
      recipient: email,
    };
  } catch (error) {
    console.error('Error sending maintenance update email:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date(),
    };
  }
};

/**
 * Send welcome email to new tenant
 * @param {Object} data - Email data
 * @param {string} data.tenantEmail - Tenant email address
 * @param {string} data.tenantName - Tenant name
 * @param {string} data.propertyName - Property name
 * @param {string} data.unitNumber - Unit number
 * @param {string} data.leaseStartDate - Lease start date
 * @param {string} data.ownerName - Property owner name
 * @param {string} data.ownerPhone - Owner contact phone
 * @returns {Promise<Object>} Email send result
 */
const sendWelcomeEmail = async (data) => {
  try {
    const {
      tenantEmail,
      tenantName,
      propertyName,
      unitNumber,
      leaseStartDate,
      ownerName,
      ownerPhone,
    } = data;

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
        <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px; background: linear-gradient(135deg, #06b6d4, #8b5cf6); color: white; padding: 20px; border-radius: 8px;">
            <div style="font-size: 24px; font-weight: bold;">🎉 Welcome to RentManager!</div>
          </div>

          <h2 style="color: #333; margin-bottom: 20px;">Welcome ${tenantName}!</h2>

          <p style="color: #555; line-height: 1.6;">
            We're excited to have you as a tenant at <strong>${propertyName}</strong>. This email contains important information about your tenancy.
          </p>

          <div style="background: #f0f9ff; border-left: 4px solid #06b6d4; padding: 15px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Your Living Details</h3>
            <table style="width: 100%; color: #333;">
              <tr>
                <td style="padding: 8px 0;"><strong>Property:</strong></td>
                <td style="text-align: right;">${propertyName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Unit:</strong></td>
                <td style="text-align: right;">${unitNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Move-in Date:</strong></td>
                <td style="text-align: right;">${new Date(leaseStartDate).toLocaleDateString('en-IN')}</td>
              </tr>
            </table>
          </div>

          <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Property Manager Contact</h3>
            <p style="color: #555; margin: 8px 0;"><strong>${ownerName}</strong></p>
            <p style="color: #555; margin: 8px 0;">📱 Phone: ${ownerPhone}</p>
          </div>

          <p style="color: #555; line-height: 1.6; margin: 20px 0;">
            <strong>Quick Links:</strong>
          </p>
          <ul style="color: #555; line-height: 1.8;">
            <li>View and pay invoices</li>
            <li>Track maintenance requests</li>
            <li>Message your property manager</li>
            <li>Access lease documents</li>
          </ul>

          <p style="color: #888; font-size: 12px; line-height: 1.6; margin-top: 20px;">
            If you have any questions or need assistance, please don't hesitate to contact your property manager.
          </p>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              © 2026 RentManager. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `;

    const mail = await initializeTransporter().sendMail({
      from: emailConfig.from,
      to: tenantEmail,
      subject: `Welcome to ${propertyName}!`,
      html: htmlContent,
    });

    return {
      success: true,
      messageId: mail.messageId,
      timestamp: new Date(),
      recipient: tenantEmail,
    };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date(),
    };
  }
};

/**
 * Test email connection
 * @returns {Promise<Object>} Test result
 */
const testEmailConnection = async () => {
  try {
    await initializeTransporter().verify();
    return {
      success: true,
      message: 'Email service connected successfully',
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Email connection test failed:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date(),
    };
  }
};

module.exports = {
  sendRentReminderEmail,
  sendInvoiceNotificationEmail,
  sendLeaseExpiryAlertEmail,
  sendMaintenanceUpdateEmail,
  sendWelcomeEmail,
  testEmailConnection,
};
